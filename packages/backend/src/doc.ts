import { Logger } from '@nestjs/common';

import { bootstrapDoc } from './swagger';

async function run(): Promise<void> {
    try {
        Logger.log('starting Doc');
        const app = await bootstrapDoc();
        Logger.log(await app.getUrl() + '/doc', 'Doc');
    } catch (error) {
        Logger.error(error.stack, 'Doc');
    }
}

run();
