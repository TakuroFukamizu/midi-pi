import dotenv from 'dotenv';
import MidiSequenceController, { EventExecNoteMidi, EventExecControllerMidi, EventEndOfMidi } from './controller/midiSequence';
import ComInterProcess from './com/interSocket';
import ManualController, { EventOnHotkeyPressed} from './controller/manual';
import loadConfig from './utils/loadConfig';
import { UserConfigPlaylistItemInterface, UserConfigInterface } from './models/userconfig'

let BFF_PORT: number;
let BFF_HOST: string;
let DEMO_MODE: boolean;

let inter: ComInterProcess;
let player: MidiSequenceController;
let manual: ManualController;

let userConfig: UserConfigInterface;

/** 設定読込, 管理系インスタンスの作成 */
function setup() { 
    // load dotenv
    dotenv.config();
    BFF_HOST = process.env.BFF_HOST || 'localhost';
    BFF_PORT = parseInt(process.env.BFF_PORT || '8080');
    DEMO_MODE = process.env.DEMO_MODE ? true : false;
    console.info(`config: ${BFF_HOST}, ${BFF_PORT}, ${DEMO_MODE}`);

    // load userConfig.json
    userConfig = loadConfig();

    // setup instances
    inter = new ComInterProcess(BFF_HOST, BFF_PORT);
    player = new MidiSequenceController();
    manual = new ManualController(userConfig.keyboardVendorId, userConfig.keyboardProductId);
    manual.applyPlaylist(userConfig.playlist);
}

/** 演奏の実行 */
async function play(playitem: UserConfigPlaylistItemInterface) {
    console.info(`play midi: ${playitem.filepath}`);
    player.loadFile(playitem);

    inter.setNewTilte({ title: playitem.title }); //新しい曲をセット

    // 先にタイムラインデータを作ってフロントエンドに送る
    const timelineData = player.makeTimeline();
    inter.sendTimeline(timelineData); // BFFにタイムラインを送信

    inter.playStart();
    await player.play();
}

async function main() {
    console.log('start main');

    // BFFの起動待ち
    await inter.waitLaunch(5);
    console.log('bff started');

    if (!DEMO_MODE) player.setMidiInterface();
    player.on(EventExecNoteMidi, async (data) => {
        inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });
    player.on(EventExecControllerMidi, async (data) => {
        inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });
    player.on(EventEndOfMidi, async (data) => {
        console.log('end of midi file');
        // inter.sendExecNotify(data); // BFFに実行したmidiの情報を送信
    });

    // キーボードで実行
    manual.on(EventOnHotkeyPressed, async (data: UserConfigPlaylistItemInterface) => {
        await play(data);
    });
    console.info('finish setup process');

    // await play(userConfig.playlist[0]);
};

try {
    setup();
    main();
    process.exit(0);
} catch (ex) { 
    console.error(ex);
    process.exit(1);
}
