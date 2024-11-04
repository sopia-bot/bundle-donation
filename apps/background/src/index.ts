// import { createRequire } from 'module';
import express, {Request, Response, NextFunction} from 'express';
import { ElevenLabs } from './elevenlabs';
import path from 'path';
// const bquire = createRequire(path.resolve());
// const { ElevenLabs } = bquire('elevenlabs');
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

app.use('/', router);

module.exports = app;