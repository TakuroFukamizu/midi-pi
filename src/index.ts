import MidiFileReader from './midi/fileReader';
import MidiInterfaceDriver, { getDevices } from './midi/interfaceDriver';

console.log(getDevices());

async function main() { 
    // Read MIDI file into a buffer
    // var input = fs.readFileSync('work/imperial.mid');
    // var input = fs.readFileSync('work/simple.mid');
    const input = 'work/simple_2multi.mid';
    const interfaceName = 'hoge';

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
