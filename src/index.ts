import dotenv from 'dotenv';
import MidiSequenceController, { EventExecNoteMidi, EventExecControllerMidi, EventEndOfMidi } from './controller/midiSequence';
import ComInterProcess from './com/inter';
import ManualController from './controller/manual';
import loadConfig from './utils/loadConfig';
import { UserConfigPlaylistItemInterface } from './models/userconfig'

dotenv.config();
const BFF_PORT = parseInt(process.env.BFF_PORT || '80');
const DEMO_MODE = true;

const userConfig = loadConfig();

const inter = new ComInterProcess(BFF_PORT)
const player = new MidiSequenceController();
const manual = new ManualController();
manual.apply();

async function main() { 
    // BFFの起動待ち
    if (!await inter.waitLaunch(10)) { 
        throw new Error('Backend for Frontend server has internal serever error');
    }

    const play = async (playitem: UserConfigPlaylistItemInterface) => {
        player.loadFile(playitem);

        await inter.setNewTilte({ title: playitem.title }); //新しい曲をセット

        // 先にタイムラインデータを作ってフロントエンドに送る
        const timelineData = player.makeTimeline();
        await inter.sendTimeline(timelineData); // BFFにタイムラインを送信

        await inter.playStart();
        await player.play();
    };

    if (!DEMO_MODE) player.setMidiInterface();
    player.on(EventExecNoteMidi, async (data) => {
        await inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });
    player.on(EventExecControllerMidi, async (data) => {
        await inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });
    player.on(EventEndOfMidi, async (data) => {
        console.log('end of midi file');
        // await inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });

    // TODO: キーボード対応
    await play(userConfig.playlist[0]);
    await play(userConfig.playlist[1]);
}
try {
    main();
} catch (ex) { 
    console.error(ex);
}
