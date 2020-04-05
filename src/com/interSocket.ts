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

    init() {
        console.info(`connect to bff.socket ${this.host}, ${this.port}`);
        const options: SocketIOClient.ConnectOpts = {
            host: this.host,
            port: this.port.toString(),
            reconnection: true,
            timeout: 5000,
            autoConnect: false
        };
        // this.socket = io(`${this.host}:${this.port}`);
        this.socket = io(options);
        this.socket.on('reconnecting', (attemptNumber: any) => {
            console.log('socket:reconnecting...', attemptNumber);
        });
    }

    waitLaunch(tryLimit: number = 3) { 
        this.init();
        if (!this.socket) throw new Error('io error');
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('socket.io is failed'));
                return;
            }
            this.socket.on('connect', () => {
                console.info('connected');
                resolve(true);
            });
            this.socket.on('connect_error', (error: any) => {
                console.error('connect_error');
                reject(error);
            });
            this.socket.on('connect_timeout', (error: any) => {
                console.error('connect_timeout');
                reject(error);
            });
            this.socket.open();
            console.log('socket.client open');
            resolve(true);
        });
    }

    private emit(eventName: string, data?: any) { 
        // if (!this.socket) throw new Error('invalid operation');
        if (!this.socket) return;
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