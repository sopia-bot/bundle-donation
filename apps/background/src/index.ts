import express, {Request, Response, NextFunction} from 'express';
import { ElevenLabs } from './elevenlabs';
import { runInitMigration } from './db';
import path from 'node:path';
import logger from './logger';
import { PrismaClient } from './prisma';
import crypto from 'node:crypto';
const app = express();
app.use(express.json());
app.set('etag', false);
const dbPath = path.resolve(__dirname, '../../config.db');
process.env['DATABASE_URL'] = `file:${dbPath}`;

const elabs = new ElevenLabs();
const prisma = new PrismaClient();

const router = express.Router();
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('hello').end();
});

router.get('/voices', async (req: Request, res: Response) => {  
    // const list = await elabs.getVoices();
    // res.json(list);
    res.json([]);
});

router.post('/generate', async (req: Request, res: Response) => {
    const text = req.body.text;
    const voiceId = req.body.voiceId;

    try {
        const data = await elabs.tts(text, voiceId);
        console.log('generate', data.length);
        res.send(data);
    } catch(err) {
        console.log('error!!!!', err);
        logger.error(`[${req.route.path}] catch-error ::`, err);
    }
});

router.get('/templates', async (req: Request, res: Response) => {
    try {
        const templateList = await prisma.template.findMany();
        res.json(templateList);
    } catch(err) {
        console.log('error!!!!', err);
        logger.error(`[${req.route.path}] catch-error ::`, err);
    }
});

router.put('/template', async (req: Request, res: Response) => {
    try {
        const template = req.body;

        console.log('template', template);
        
        if ( typeof template.name !== 'string' || template.name.trim() === '' ) {
            logger.error(`[${req.route.path}] params error template.name=${template.name}`);
            res.json({
                success: false,
                err_desc: 'params',
            });
            return;
        }

        const result = await prisma.template.create({
            data: {
                uuid: crypto.randomUUID(),
                name: template.name,
            },
        });
        console.log('result', result);

        res.json({
            success: true,
        });
    } catch(err) {
        console.log('error!!!!', err);
        logger.error(`[${req.route.path}] catch-error ::`, err);
        res.json({
            success: false,
            err_desc: 'catch',
        });
    }
});

app.use('/', router);

declare global {
    const __pkgdir: string;
}
runInitMigration(path.join(__pkgdir, 'config.db'), path.join(__pkgdir, 'migrations'));
console.log('Donation app loaded!');

// module.exports = app;
export default app;