import {pino, Logger} from 'pino';
import path from 'node:path';
const logger: Logger = pino(
    pino.destination(path.join(__pkgdir, 'logs'))
);

export default logger;