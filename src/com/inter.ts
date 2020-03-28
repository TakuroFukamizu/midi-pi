import request from 'request';

const HOST = 'http://localhost';

export default class ComInterProcess { 
    private port: number;

    constructor(port: number) { 
        this.port = port;
    }

    private async post(path: string, data?:any) { 
        const options = {
            url: `${HOST}:${this.port}${path}`,
            method: 'POST',
            json: true,
            body: data || null
        };
        return new Promise((resolve, reject) => { 
            request(options, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response);
            });
        });

    }

    async sendTimeline(data:any) { 
        return await this.post('/api/timeline', data);
    }

    async setNewTilte(data: any) {
        return await this.post('/api/setnewtitle', data);
    }

    async playStart() {
        return await this.post('/api/play/start');
    }

    async playPause() {
        return await this.post('/api/play/pause');
    }

    async playChancel() {
        return await this.post('/api/play/chancel');
    }

    async sendExecNotify(data:any) { 
        return await this.post('/api/execnotify', data);
    }


}