import dotenv from 'dotenv';
import MidiSequenceController, { EventExecNoteMidi, EventExecControllerMidi, EventEndOfMidi } from './controller/midiSequence';
import ComInterProcess from './com/inter';
import ManualController, { EventOnHotkeyPressed} from './controller/manual';
import loadConfig from './utils/loadConfig';
import { UserConfigPlaylistItemInterface } from './models/userconfig'

let BFF_PORT: number;
let DEMO_MODE: boolean;

let inter: ComInterProcess;
let player: MidiSequenceController;
let manual: ManualController;

function setup() { 
    // load dotenv
    dotenv.config();
    BFF_PORT = parseInt(process.env.BFF_PORT || '80');
    DEMO_MODE = process.env.DEMO_MODE ? true : false;

    // load userConfig.json
    const userConfig = loadConfig();

    // setup instances
    inter = new ComInterProcess(BFF_PORT);
    player = new MidiSequenceController();
    manual = new ManualController(userConfig.keyboardVendorId, userConfig.keyboardProductId);
    manual.applyPlaylist(userConfig.playlist);
}

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

    // キーボードで実行
    manual.on(EventOnHotkeyPressed, async (data: UserConfigPlaylistItemInterface) => {
        await play(data);
    });
    console.info('finish setup process');
};

try {
    setup();
    main();
    process.exit(0);
} catch (ex) { 
    console.error(ex);
    process.exit(1);
}
