import dotenv from 'dotenv';
import MidiSequenceController, { EventExecNoteMidi, EventExecControllerMidi, EventEndOfMidi } from './controller/midiSequence';
import ComInterProcess from './com/inter';
import ManualController from './controller/manual';

dotenv.config();
const BFF_PORT = parseInt(process.env.BFF_PORT || '80');
const DEMO_MODE = true;

// const input = 'work/imperial.mid';
const input = 'work/simple.mid';
const input2 = 'work/simple_2multi.mid';
const input3 = 'work/simple_2multi_SMF1.mid';

const inter = new ComInterProcess(BFF_PORT)
const player = new MidiSequenceController();
const manual = new ManualController();
manual.apply();

async function main() { 

    const play = async (filepath: string) => {
        player.loadFile(filepath);

        await inter.setNewTilte({ title: player.title }); //新しい曲をセット

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

    await play(input);
    await play(input2);
    await play(input3);
}
try {
    main();
} catch (ex) { 
    console.error(ex);
}
