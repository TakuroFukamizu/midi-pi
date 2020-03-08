var fs = require('fs');
var parseMidi = require('midi-file').parseMidi;
 
// Read MIDI file into a buffer
var input = fs.readFileSync('work/imperial.mid');
var parsed = parseMidi(input);
console.log(parsed.header);
for (const track of parsed.tracks) { 
    console.log(track.length);
    for (const item of track) { 
        console.log(item.deltaTime, item.type, JSON.stringify(item));
    }
}
