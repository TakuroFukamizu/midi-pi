
export interface UserConfigInterface { 
    playlist: UserConfigPlaylistItemInterface[];
}

export interface UserConfigPlaylistItemInterface { 
    title: string;
    hotkey: string;
    filepath: string;
}