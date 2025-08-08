

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import dayjs from 'dayjs';
import { mkdirpSync } from 'mkdirp';
import { multistream } from 'pino';

import type { Request } from 'express';
import type { Params } from 'nestjs-pino';
import type { ReqId } from 'pino-http';

const PASS_URL = new Set(['/health', '/graphql']);

const rootDir = resolve(__dirname, '../../');
const appName = process.env.npm_package_name || 'app';

const logdir = join(rootDir, 'logs/'); // note: 不能使用绝对路径
if (!existsSync(logdir)) {
    mkdirpSync(logdir);
}
const logfile = join(logdir, appName); // note: 不能使用绝对路径
console.log('nest log file:', resolve(logfile), new Date());

interface RequestWithCustom extends Request {
    customProps: Record<string, any>;
}

export const loggerOptions: Params = {
    pinoHttp: [
        {
            // https://getpino.io/#/docs/api?id=timestamp-boolean-function
            // Change time value in production log.
            // timestamp: stdTimeFunctions.isoTime,
            quietReqLogger: true,
            genReqId: (req): ReqId => (<Request>req).header('X-Request-Id'), // ?? nanoid(),
            ...(process.env.NODE_ENV === 'production'
                ? {
                    // https://www.npmjs.com/package/pino-roll
                    level: 'error',
                    transport: {
                        target: 'pino-roll',
                        options: {
                            file: resolve(__dirname, '../../', appName),
                            size: '10m',
                            // 周期
                            frequency: 'daily',
                            mkdir: true,
                            extension: `.${dayjs().format('yyyy-MM-dd')}.log`,
                        },
                    },
                }
                : {
                    level: 'debug',
                    // https://github.com/pinojs/pino-pretty
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            sync: true,
                            singleLine: true,
                        },
                    },
                }),

            autoLogging: {
                ignore: (req) => PASS_URL.has((<Request>req).originalUrl),
            },
            customProps: (req) => (<RequestWithCustom><unknown>req).customProps,
        },

        multistream(
            [
                // https://getpino.io/#/docs/help?id=log-to-different-streams
                { level: 'debug', stream: process.stdout },
                { level: 'error', stream: process.stderr },
                { level: 'fatal', stream: process.stderr },
            ],
            { dedupe: true }
        ),
    ],
};
