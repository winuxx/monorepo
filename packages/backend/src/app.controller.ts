import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ApiQuery({ name: 'title' })
    getHello(@Query('title') title: string): string {
        return this.appService?.getHello(title);
    }
}
