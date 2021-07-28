import * as log from 'loglevel';
import {LogLevelDesc} from 'loglevel';
import {startServer} from './main/express';

export async function main() {
    log.setLevel(process.env.LOG_LEVEL as LogLevelDesc || 'info');

    try {
        startServer();
    } catch(e) {
        log.error(e);
        return;
    }
}
