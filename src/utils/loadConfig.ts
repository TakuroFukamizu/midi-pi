import path from 'path';
import fs from 'fs';
import { UserConfigInterface } from "../models/userconfig";

const CONFIG_FILENAME = 'userConfig.json';


export default function loadConfig() { 
    const filepaht = path.join(__dirname, '..', '..', CONFIG_FILENAME);
    const json = JSON.parse(fs.readFileSync(filepaht, 'utf8'));
    if (!json['playlist']) throw new Error('invalid file');
    const playlist = json['playlist'];
    const keyboardVendorId = parseInt(json['keyboardVendorId'], 16);
    const keyboardProductId = parseInt(json['keyboardProductId'], 16);
    return { playlist, keyboardVendorId, keyboardProductId } as UserConfigInterface;
}