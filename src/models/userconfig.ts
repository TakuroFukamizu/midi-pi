
export interface UserConfigInterface { 
    playlist: UserConfigPlaylistItemInterface[];
    keyboardVendorId: number;
    keyboardProductId: number;
}

export interface UserConfigPlaylistItemInterface { 
    id: number;
    title: string;
    hotkey: string;
    filepath: string;
}