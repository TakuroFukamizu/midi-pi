import MidiFileReader from './midi/fileReader';

// const input = 'work/imperial.mid';
// const input = 'work/simple.mid';
// const input = 'work/simple_2multi.mid';
// const input = 'work/simple_2multi_SMF1.mid';
const input = 'work/simple_2multi_addControlChange_SMF0.mid';

const file = new MidiFileReader(input);
file.read();
file.printTracks();
