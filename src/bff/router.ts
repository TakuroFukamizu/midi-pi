import express from 'express';
import eventHub from './eventhub';

const router: express.Router = express.Router();

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