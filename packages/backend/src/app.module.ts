import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSourceOptions } from 'typeorm';

import config from '~/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerOptions } from './config';
import { ProductModule } from './modules/product';

@Module({
    imports: [
        LoggerModule.forRoot(loggerOptions),
        TypeOrmModule.forRoot({
            ...config.db,
            autoLoadEntities: true,
            synchronize: true, // Note: set to false in production
        } as DataSourceOptions),
        ProductModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
