// node-hid-stream is can't run at macbook
import events from 'events';
const nodeHidStream = require('node-hid-stream');
import { UserConfigPlaylistItemInterface } from '../models/userconfig';



export const EventOnHotkeyPressed = Symbol('EventOnHotkeyPressed');

export default class ManualController extends events.EventEmitter { 
    private list: UserConfigPlaylistItemInterface[] = [];
    private characters: any;

    constructor(vendorId: number, productId: number) { 
        super();

        const KeyboardCharacters = nodeHidStream.KeyboardCharacters;
        this.characters = new KeyboardCharacters({ vendorId, productId });
        
        this.characters.on("data", (data: string) => {
            if (data.length == 0) return;
            for (const item of this.list) { 
                if (item.hotkey.toLowerCase() == data.toLowerCase()) {
                    this.emit(EventOnHotkeyPressed, item);
                }
            }
            console.log(data, typeof(data), data.length);
        });
    }

    applyPlaylist(list: UserConfigPlaylistItemInterface[]) { 
        this.list = list;
    }

    // TODO: キーに応じて停止

}

