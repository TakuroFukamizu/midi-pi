import MidiFileReader from './midi/fileReader';
import MidiInterfaceDriver, { getDevices } from './midi/interfaceDriver';

// const input = 'work/imperial.mid';
// const input = 'work/simple.mid';
const input = 'work/simple_2multi.mid';

async function main() {
    const interfaceName = getDevices()[0];
    console.info(`use midi interface: ${interfaceName}`);

    const device = new MidiInterfaceDriver(interfaceName);
    const file = new MidiFileReader(input);
    file.read();
    // file.printTracks(100);
    for await (let data of file.datas()) { 
        const payload = { note: data.noteNumber, velocity: data.velocity, channel: data.channel };
        device.output(data.type, payload );
    }
}
main();
