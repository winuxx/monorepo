// import { resolve } from 'node:path';

import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import config from '../config';

import { AppModule } from './app.module';
// import { bootstrapDoc } from './swagger';

import type { NestExpressApplication } from '@nestjs/platform-express';

const isProduction = process.env.NODE_ENV === 'production';

// const rootDir = resolve(__dirname, '..');
// const appName = process.env.npm_package_name;
// const appVer = process.env.npm_package_version;

// global.APP_NAME = appName || '';
// global.APP_VER = appVer || '';
// global.ROOT_DIR = rootDir || '';

const PORT = process.env.PORT || config.port || 3000
const BASE = process.env.BASE || config.base || '/';
// const DOC_URI = BASE + '/doc'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    app.setGlobalPrefix(BASE);
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    if (isProduction) {
        app.enable('trust proxy');
    }

    app.enableShutdownHooks();
    await app.listen(PORT);

    return app;
}

async function run() {
    try {
        const app = await bootstrap();
        const url = await app.getUrl()
        NestLogger.log(url, 'Bootstrap');
        // await bootstrapDoc(app);
        // NestLogger.log(url + DOC_URI, 'Doc');
    } catch (error) {
        NestLogger.error(error, 'Bootstrap');
    }
}

run();
