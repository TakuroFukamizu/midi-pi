
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import http from "http";
import socketio from 'socket.io';
import router from './router';

dotenv.config();
const PORT = parseInt(process.env.BFF_PORT || '8080');
const PUBLIC_PATH = process.env.PUBLIC_PATH || path.join(__dirname, '..', '..', 'dist');

  
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server, {
    serveClient: false
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_PATH));
app.use('/api', router);

io.on("connection", (socket: socketio.Socket) => {
    // Broadcasting events
    socket.on('setnewtitle', (data: any) => io.emit('setnewtitle', data));
    socket.on('timeline', (data: any) => io.emit('timeline', data));
    socket.on('play.start', (data: any) => io.emit('playstart', data));
    socket.on('play.pause', (data: any) => io.emit('playpause', data));
    socket.on('play.cancel', (data: any) => io.emit('playcancel', data));
    socket.on('execnotify', (data: any) => io.emit('execnotify', data));
});

server.listen(PORT, () => {
    console.info(`app listening on port ${PORT}!`);
});

