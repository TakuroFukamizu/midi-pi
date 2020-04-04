import io from 'socket.io-client';
import { aswait } from '../utils/AsyncTimeout';


export default class ComInterProcess { 
    private host: string;
    private port: number;
    private socket?: SocketIOClient.Socket;

    constructor(host: string, port: number) { 
        this.port = port;
        this.host = host;
    }

    async waitLaunch(tryLimit: number = 3) { 
        this.socket = io(`${this.host}:${this.port}`);
        if (!this.socket) throw new Error('io error');
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('socket.io is failed'));
                return;
            }
            this.socket.on('connect', () => {
                resolve(true);
            });
        });
    }

    private emit(eventName: string, data?: any) { 
        if (!this.socket) throw new Error('invalid operation');
        this.socket.emit(eventName, data);
    }

    sendTimeline(data: any) { 
        this.emit('timeline', data);
    }

    setNewTilte(data: any) {
        this.emit('setnewtitle', data);
    }

    playStart() {
        this.emit('play.start');
    }

    playPause() {
        this.emit('play.pause');
    }

    playChancel() {
        this.emit('play.chancel');
    }

    sendExecNotify(data:any) { 
        this.emit('execnotify', data);
    }

}