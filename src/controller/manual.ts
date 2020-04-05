// node-hid-stream is can't run at macbook
import events from 'events';
const { KeyboardCharacters } = require('node-hid-stream');
import { UserConfigPlaylistItemInterface } from '../models/userconfig';

export const EventOnHotkeyPressed = Symbol('EventOnHotkeyPressed');

export default class ManualController extends events.EventEmitter { 
    private list: UserConfigPlaylistItemInterface[] = [];
    private characters: any;

    constructor(vendorId: number, productId: number) { 
        super();
        console.info(`use HID: vendorId: ${vendorId}, productId: ${productId}`);

        this.characters = new KeyboardCharacters({ vendorId, productId });
        // console.log(JSON.stringify(this.characters, null, 4));
        
        this.characters.on('data', (data: string) => {
            console.log(data, typeof(data), data.length);
            if (data.length == 0) return;
            console.log(data, typeof(data), data.length);
            for (const item of this.list) { 
                if (item.hotkey.toLowerCase() == data.toLowerCase()) {
                    this.emit(EventOnHotkeyPressed, item);
                }
            }
        });
    }

    applyPlaylist(list: UserConfigPlaylistItemInterface[]) { 
        this.list = list;
    }

    // TODO: キーに応じて停止

}

