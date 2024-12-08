import express, {Request, Response, NextFunction} from 'express';
import { ElevenLabs } from './elevenlabs';
import { runInitMigration } from './db';
import path from 'node:path';
const app = express();
app.use(express.json());

const elabs = new ElevenLabs();

const router = express.Router();
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('hello').end();
});

router.get('/voices', async (req: Request, res: Response) => {  
    const list = await elabs.getVoices();
    res.json(list);
});

router.post('/generate', async (req: Request, res: Response) => {
    const text = req.body.text;
    const voiceId = req.body.voiceId;

    try {
        const data = await elabs.tts(text, voiceId);
        console.time('encoding');
        const b64 = Buffer.from(data, 'binary').toString('base64');
        console.timeEnd('encoding');
        res.json({
            data: b64,
        });
    } catch(err) {
        console.log('error!!!!', err);
    }
});

app.use('/', router);

declare global {
    const __pkgdir: string;
}
runInitMigration(path.join(__pkgdir, 'config.db'), path.join(__pkgdir, 'migrations'));

// module.exports = app;
export default app;