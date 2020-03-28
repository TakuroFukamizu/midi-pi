# midi pi

Easy-to-use midi master device build with Raspberry pi

## Requirements

### Hardware

- Raspberry pi 4
- Midi output interface device
- LCD display
- additional keyboard

### Software

- Raspbian
- node.js
- yarn
- pm2
- chrome

## config

userConfig.json
```
{
    "playlist" : [
        { "hotkey" : "1", "filepath" : "./work/simple1.mid", "title" : "1 banme!" },
        { "hotkey" : "2", "filepath" : "./work/simple2.mid", "title" : "2 banme!" },
        { "hotkey" : "3", "filepath" : "./work/simple3.mid", "title" : "3 banme!" },
        { "hotkey" : "4", "filepath" : "./work/simple4.mid", "title" : "4 banme!" }
    ]
}
```

## Todo

- [x] read midi file
- [ ] implement timeline event loop to playing midi
- [ ] output midi command to midi device
- [ ] listen key event
- [ ] make gui and communicate via socket.io
- [ ] manage process by PM2
- [ ] implement play list mode
