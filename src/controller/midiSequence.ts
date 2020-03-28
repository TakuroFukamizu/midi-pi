import events from 'events';
import MidiFileReader, { ControllerItemInterface, NoteItemInterface } from '../midi/fileReader';
import MidiInterfaceDriver, { getDevices } from '../midi/interfaceDriver';
import { UserConfigPlaylistItemInterface } from '../models/userconfig';

export const EventExecNoteMidi = Symbol('EventExecNoteMidi');
export const EventExecControllerMidi = Symbol('EventExecControllerMidi');
export const EventEndOfMidi = Symbol('EventEndOfMidi');

export default class MidiSequenceController extends events.EventEmitter { 
    private device: MidiInterfaceDriver;
    private currentFile?: MidiFileReader;
    private channnelStatus: boolean[] = [];
    private numOfChannnels: number = 0;

    constructor() { 
        super();
        this.device = new MidiInterfaceDriver(); // dummy mode
    }

    // get title() { 
    //     return this.currentFile!.title;
    // }
    
    setMidiInterface() { 
        const interfaceName = this.currentMidiDevice();
        console.info(`use midi interface: ${interfaceName}`);
        this.device = new MidiInterfaceDriver(interfaceName);
    }

    private currentMidiDevice() { 
        const physicalMidis = [];
        for (let midi of getDevices()) { 
            if (midi.startsWith('Midi Through:Midi Through Port')) continue;
            physicalMidis.push(midi);
        }
        if (physicalMidis.length == 0) throw new Error('midi interface is not found');
    
        return physicalMidis[0];
    }

    loadFile(playItem: UserConfigPlaylistItemInterface) { 
        // this.title = playItem.title;
        this.currentFile = new MidiFileReader(playItem.filepath);
        this.currentFile.read();
        console.info(`load midi file from: ${playItem.filepath}`);
        // file.printTracks();
        // file.printTracks(100);
    }

    makeTimeline() { 
        if (!this.currentFile) throw new Error('illegal operation');

        const { timelines, channels } = this.currentFile.fetchTimelineData();
        const numOfChannnels = channels.length;
        this.numOfChannnels = numOfChannnels;
        const timelineData = {
            beatsPerMinute: this.currentFile.beatsPerMinute,
            numOfChannnels,
            timelines
        };
        // console.log(JSON.stringify(timelineData, null, 2));
        return timelineData;
    }
    
    /** 指定された MIDIファイルをロードし、デバイスで演奏する */
    async play() { 
        if (!this.currentFile) throw new Error('illegal operation');
        this.channnelStatus = [];
        for (let i = 0; i < this.numOfChannnels; i++) { 
            this.channnelStatus.push(false); // off
        }
    
        for await (let data of this.currentFile.datas()) { 
            switch (data.type) { 
                case 'noteOn':
                case 'noteOff': { 
                    const item = (data as NoteItemInterface);
                    this.channnelStatus[item.channel] = item.type == 'noteOn' ? true : false;
                    this.execNoteMidi(item);
                    break;
                }
                case 'controller':
                    this.execControllerMidi(data as ControllerItemInterface);
                    break;
                case 'endOfTrack':
                    this.emit(EventEndOfMidi);
                    return;
            }
        }
    }

    /** noteOn, noteOff の MIDI 信号を送信する */
    private async execNoteMidi(data: NoteItemInterface) { 
        this.device.output(data.type, {
            note: data.noteNumber,
            velocity: data.velocity,
            channel: data.channel
        });
        this.emit(EventExecNoteMidi, data);
    }

    /** controller の MIDI 信号を送信する */
    private async execControllerMidi(data: ControllerItemInterface) { 
        this.device.output(data.type, {
            controllerType: data.controllerType,
            value: data.value,
            channel: data.channel
        });
        this.emit(EventExecControllerMidi, data);
    }

    stop() { 
        this.allStopMidiCommand();
    }

    /** MIDIで全停止信号を送る */
    allStopMidiCommand() { 
        this.device.output('controller', { controllerType: 120, value: 0, channel: 0 });
        this.device.output('controller', { controllerType: 123, value: 0, channel: 0 });
    }
}