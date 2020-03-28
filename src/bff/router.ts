import express from 'express';
import eventHub from './eventhub';

const router: express.Router = express.Router();

/** ヘルスチェックの応答用 */
router.post('/echo', async (req: express.Request, res: express.Response) => res.sendStatus(200) );

/** 新しい曲を読み込み */
router.post('/setnewtitle', async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const body = req.body;
        eventHub.emit('setnewtitle', body);
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});

/** タイムライン情報を連携 */
router.post('/timeline', async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const body = req.body;
        eventHub.emit('timeline', body);
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});

/** 現在のMIDIファイルの演奏開始 */
router.post('/play/start', async (req: express.Request, res: express.Response) => {
    try {
        eventHub.emit('playstart');
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});

/** 現在のMIDIファイルの演奏一次停止 */
router.post('/play/pause', async (req: express.Request, res: express.Response) => {
    try {
        eventHub.emit('playpause');
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});

/** 現在のMIDIファイルの演奏キャンセル */
router.post('/play/cancel', async (req: express.Request, res: express.Response) => {
    try {
        eventHub.emit('playcancel');
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});


/** MIDI制御にてMIDI信号を送信したことを通知 */
router.post('/execnotify', async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const body = req.body;
        eventHub.emit('execnotify', body);
        res.sendStatus(200);
    } catch (ex) { 
        res.sendStatus(500);
    }
});

export default router;