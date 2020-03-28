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