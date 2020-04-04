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
- libraries
  - alsa
  - libudev
  - libusb
- node.js
- yarn
- pm2
- chrome

## Setup

### Install libraries

```sh
sudo apt install libasound2-dev libudev-dev libusb-1.0-0-dev
```

### Install node libraries

```sh
yarn install
cd frontend
yarn install
```


## config

### dotenv

```sh
BFF_PORT=8080
```

### userConfig.json

```json
{
    "playlist" : [
        { "id" : 0, "hotkey" : "1", "filepath" : "./work/simple1.mid", "title" : "1 banme!" },
        { "id" : 1, "hotkey" : "2", "filepath" : "./work/simple2.mid", "title" : "2 banme!" },
        { "id" : 2, "hotkey" : "3", "filepath" : "./work/simple3.mid", "title" : "3 banme!" },
        { "id" : 3, "hotkey" : "4", "filepath" : "./work/simple4.mid", "title" : "4 banme!" }
    ],
    "keyboardVendorId" : "0x05ac",
    "keyboardProductId" : "0x0256"
}
```

## Run 

```
yarn build
yarn start
```

## Todo

- [x] read midi file
- [ ] implement timeline event loop to playing midi
- [ ] output midi command to midi device
- [ ] listen key event
- [ ] make gui and communicate via socket.io
- [ ] manage process by PM2
- [ ] implement play list mode
