import fs from 'fs';
import { aswait } from '../utils/AsyncTimeout';
// import midiFile from 'midi-file';
const midiFile = require('midi-file');
const parseMidi = midiFile.parseMidi;

export interface NoteItemInterface { 
    type: string;
    channel: number;
    noteNumber: number;
    velocity: number;
}

export default class MidiFileReader { 
    filepath: string = '';
    format: number = 0;
    numTracks: number = 0;
    ticksPerBeat: number = 0;
    tracks: any[] = [];
    beatsPerMinute: number = 120;

    constructor(filepath: string) { 
        this.filepath = filepath;
    }

    read() { 
        const input = fs.readFileSync(this.filepath);
        const parsed = parseMidi(input);
        // read headers chunk
        this.format = parsed.header['parsed'];
        this.numTracks = parsed.header['numTracks'];
        this.ticksPerBeat = parsed.header['ticksPerBeat'];
        // read truck chunk
        this.tracks = parsed.tracks;
    }

    printTracks(limit: number = 0) { 
        for (const track of this.tracks) { 
            let limitCount = 0;
            for (const item of track) { 
                console.log(JSON.stringify(item));
                limitCount++;
                if (0 < limit && limit < limitCount) break;
            }
        }
    }

    calcMicrosecondsPerBeat() { 
        return Math.round(60 * 1000 * 1000 / this.beatsPerMinute / this.ticksPerBeat);
    }

    async * datas() { 
        let currentMicrosecondsPerBeat = this.calcMicrosecondsPerBeat();
        const rows = this.tracks[0];
        for (const row of rows) { 
            const type = row['type'];
            const deltaTime = row['deltaTime'];
            const deltaTimeInMs = Math.round((deltaTime * currentMicrosecondsPerBeat) / 1000);
            switch (type) { 
                case 'noteOn':
                case 'noteOff':
                    const channel = row['channel'];
                    const noteNumber = row['noteNumber'];
                    const velocity = row['velocity'];
                    await aswait(deltaTimeInMs);
                    yield { type, channel, noteNumber, velocity } as NoteItemInterface;
                    break;
                case 'setTempo':
                    await aswait(deltaTimeInMs);
                    currentMicrosecondsPerBeat = row['microsecondsPerBeat'];
                    break;
                // case 'timeSignature';
                default:
                    console.log('skip', JSON.stringify(row));
            }
        }
    }
}
