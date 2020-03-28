import fs from 'fs';
import path from 'path';
import { aswait } from '../utils/AsyncTimeout';
import { TimelineItemInterface, TimelineNoteItemInterface }  from '../models/timelineItem';
// import midiFile from 'midi-file';
const midiFile = require('midi-file');

const parseMidi = midiFile.parseMidi;


export interface MidiItemInterface { 
    type: string;
    channel: number;
}

export interface NoteItemInterface extends MidiItemInterface { 
    noteNumber: number;
    velocity: number;
}

export interface ControllerItemInterface extends MidiItemInterface { 
    controllerType: number;
    value: number;
}

export default class MidiFileReader { 
    filepath: string = '';
    filename: string = '';
    title: string = '';
    format: number = 0;
    numTracks: number = 0;
    ticksPerBeat: number = 0;
    tracks: any[] = [];
    beatsPerMinute: number = 120;

    constructor(filepath: string) { 
        this.filepath = filepath;
        this.filename = path.basename(this.filepath);
    }

    read() { 
        const input = fs.readFileSync(this.filepath);
        this.title = this.filename;

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
            console.log(track.length);
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

    parseNote(row: any) { 
        const type = row['type'];
        const channel = row['channel'];
        const noteNumber = row['noteNumber'];
        const velocity = row['velocity'];
        console.log(type, channel, noteNumber, velocity);
        return { type, channel, noteNumber, velocity } as NoteItemInterface;
    }
    parseController(row: any) { 
        const type = row['type'];
        const channel = row['channel'];
        const controllerType = row['controllerType'];
        const value = row['value'];
        console.log(type, channel, controllerType, value);
        return { type, channel, controllerType, value } as ControllerItemInterface;
    }

    async * datas() { 
        let currentMicrosecondsPerBeat = this.calcMicrosecondsPerBeat();
        const rows = this.tracks[0];
        for (const row of rows) { 
            console.log('- ', JSON.stringify(row));

            const type = row['type'];
            const deltaTime = row['deltaTime'];
            const deltaTimeInMs = Math.round((deltaTime * currentMicrosecondsPerBeat) / 1000 / 1000);

            console.log('wait', deltaTimeInMs);
            await aswait(deltaTimeInMs);
            switch (type) { 
                case 'noteOn':
                case 'noteOff':
                    yield this.parseNote(row);
                    break;
                case 'setTempo':
                    currentMicrosecondsPerBeat = row['microsecondsPerBeat'];
                    break;
                case 'controller':
                    yield this.parseController(row);
                case `endOfTrack`:
                    yield row;
                default:
                    console.log('skip', JSON.stringify(row));
            }
        }
    }
    
    fetchTimelineData() { 
        let currentMicrosecondsPerBeat = this.calcMicrosecondsPerBeat();
        const rows = this.tracks[0];

        const timelines: TimelineNoteItemInterface[] = [];
        const works: WorkTimelineNoteItemInterface[] = [];
        const channels: number[] = [];
        let currentTime: number = 0;

        for (const row of rows) { 
            const type = row['type'];
            const deltaTime = row['deltaTime'];
            const deltaTimeInMs = Math.round((deltaTime * currentMicrosecondsPerBeat) / 1000 / 1000);
            console.log(type, timelines.length, works.length)
            switch (type) { 
                case 'noteOn': 
                    currentTime += deltaTimeInMs;
                    const note = this.parseNote(row);
                    const item = {
                        startCurrentTime: currentTime,
                        kind: 'note',
                        channel: note.channel,
                        noteNumber: note.noteNumber,
                        velocity: note.velocity
                    } as WorkTimelineNoteItemInterface;
                    console.log(item);
                    works.unshift(item);

                    let flg = false;
                    for (const ch of channels) { 
                        if (ch == note.channel) { 
                            flg = true;
                        }
                    }
                    if (!flg) { 
                        channels.push(note.channel);
                    }
                    break;
                case 'noteOff': { 
                    currentTime += deltaTimeInMs;
                    const note = this.parseNote(row);
                    for (let beforeItem of works) { 
                        if (beforeItem.channel != note.channel) continue;
                        if (beforeItem.noteNumber != note.noteNumber) continue;
                        if (beforeItem.kind != 'note') continue;
                        timelines.push({
                            startTime: beforeItem.startCurrentTime,
                            endTime: currentTime,
                            durationTime: currentTime - beforeItem.startCurrentTime,
                            kind: 'note',
                            channel: note.channel,
                            noteNumber: note.noteNumber,
                            velocity: beforeItem.velocity
                        });
                        break;
                    }
                    break;
                }
                case 'setTempo':
                    currentMicrosecondsPerBeat = row['microsecondsPerBeat'];
                    break;
                // case 'timeSignature';
                default:
                    console.log('skip', JSON.stringify(row));
            }
        }
        return { timelines, channels };
    }
}


export interface WorkTimelineNoteItemInterface { 
    startCurrentTime: number;
    kind: string; // コマンド種類
    channel: number;
    noteNumber: number;
    velocity: number;
}