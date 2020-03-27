// import easymidi from 'easymidi';
const easymidi = require('easymidi');

export function getDevices() { 
    const outputs = easymidi.getOutputs();
    return outputs;
}

export default class MidiInterfaceDriver { 
    private interface: any;
    constructor(name: string) { 
        this.interface = new easymidi.Output(name);
    }
    output(kind: string, payload: any) { 
        this.interface.send(kind, payload);
        // output.send('noteon', {
        //   note: 64,
        //   velocity: 127,
        //   channel: 3
        // });
    }
}