import logger from './logger';
import { Router } from "express";
import { PrismaClient } from './prisma';
const prisma = new PrismaClient();

const router = Router();

router.get('/effect', async (req, res) => {
    try {
        const effectList = await prisma.effect.findMany();
        res.json(effectList.map((effect) => ({
            id: effect.id,
            sticker: effect.sticker,
            base64: Buffer.from(effect.sound).toString('base64'),
            soundName: effect.soundName,
            mimeType: effect.mimeType,
            volume: effect.volume,
            createAt: effect.createAt,
        })));
    } catch(err) {
        console.log('error!!!!', err);
        logger.error(`[${req.route.path}] catch-error ::`, err);
        res.json({
            success: false,
            err_desc: 'catch',
        });
    }
});

router.patch('/effect', async (req, res) => {
    try {
        const { soundName, base64, sticker, mimeType, volume } = req.body;

        if ( typeof soundName !== 'string' || soundName.trim() === '' ) {
            logger.error(`[${req.route.path}] patch params error effect.soundName=${soundName}`);
            res.json({
                success: false,
                err_desc: 'params',
            });
            return;
        }

        const effectFind = await prisma.effect.findFirst({
            where: {
                sticker,
            },
        });

        if ( effectFind ) {
            await prisma.effect.update({
                where: {
                    id: effectFind.id,
                },
                data: {
                    soundName,
                    sound: Buffer.from(base64, 'base64'),
                    sticker,
                    mimeType,
                    volume,
                },
            });
            logger.info(`[${req.route.path}] update effect=${effectFind.id} soundName=${soundName} sticker=${sticker} mimeType=${mimeType} volume=${volume}`);
        } else {
            await prisma.effect.create({
                data: {
                    soundName,
                    sound: Buffer.from(base64, 'base64'),
                    sticker,
                    mimeType,
                    volume,
                },
            });
            logger.info(`[${req.route.path}] create effect soundName=${soundName} sticker=${sticker} mimeType=${mimeType} volume=${volume}`);
        }

        // const result = await prisma.effect.update({
        //     where: {
        //         uuid: effect.uuid,
        //     },
        //     data: {
        //         name: effect.name,
        //         base64: effect.base64,
        //     },
        // });

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

export default router;