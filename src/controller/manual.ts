// node-hid-stream is can't run at macbook
import events from 'events';
import { UserConfigPlaylistItemInterface } from '../models/userconfig';

export const EventOnHotkeyPressed = Symbol('EventOnHotkeyPressed');

export default class ManualController extends events.EventEmitter { 
    private list: UserConfigPlaylistItemInterface[] = [];

    constructor() { 
        super();
    }

    applyPlaylist(list: UserConfigPlaylistItemInterface[]) { 
        this.list = list;

        // this.emit(EventOnHotkeyPressed, {  });
    }

    // TODO: キーに応じて停止

}

