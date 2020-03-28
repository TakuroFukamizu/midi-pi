import path from 'path';
import fs from 'fs';
import { UserConfigInterface } from "../models/userconfig";

const CONFIG_FILENAME = 'userConfig.json';


export default function loadConfig() { 
    const filepaht = path.join(__dirname, '..', '..', CONFIG_FILENAME);
    const json = JSON.parse(fs.readFileSync(filepaht, 'utf8'));
    if (!json['playlist']) throw new Error('invalid file');
    const playlist = json['playlist'];
    return { playlist } as UserConfigInterface;
}