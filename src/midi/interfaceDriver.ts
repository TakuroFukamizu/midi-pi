// import easymidi from 'easymidi';
const easymidi = require('easymidi');

export function getDevices() { 
    const outputs = easymidi.getOutputs();
    return outputs as string;
}

export default class MidiInterfaceDriver { 
    private interface: any;
    private isDummyMode: boolean = false;

    constructor(name?: string) { 
        if (!name) { 
            this.isDummyMode = true;
            return;
        }
        this.interface = new easymidi.Output(name);
    }
    output(kind: string, payload: any) { 
        if (this.isDummyMode) { 
            console.info(`[DUMMY MODE] skip ${kind}`, payload);
            return;
        }
        this.interface.send(kind.toLowerCase(), payload);
        // output.send('noteon', {
        //   note: 64,
        //   velocity: 127,
        //   channel: 3
        // });
    }
}