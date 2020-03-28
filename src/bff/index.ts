
import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import http from "http";
import socketio from 'socket.io';
import router from './router';
import eventHub from './eventhub';

dotenv.config();
const PORT = parseInt(process.env.BFF_PORT || '80');
const PUBLIC_PATH = process.env.PUBLIC_PATH || path.join(__dirname, '..', '..', 'dist');

  
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_PATH));
app.use('/api', router);

io.on("connection", (socket: socketio.Socket) => {
    eventHub.on('setnewtitle', (data: any) => { 
        io.emit('setnewtitle', data);
    });
    eventHub.on('timeline', (data: any) => { 
        io.emit('timeline', data);
    });
    eventHub.on('execnotify', (data: any) => { 
        io.emit('execnotify', data);
    });
});

server.listen(PORT, () => {
    console.info(`app listening on port ${PORT}!`);
});
