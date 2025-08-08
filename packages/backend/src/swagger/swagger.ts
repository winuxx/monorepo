import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '../app.module';

/**
 * https://docs.nestjs.com/recipes/swagger
 */
async function bootstrap(app: NestExpressApplication = null) {
    const isNew = !app;
    if (isNew) {
        app = await NestFactory.create<NestExpressApplication>(AppModule);
    }

    const config = new DocumentBuilder()
        .setTitle('Product Tool Documentation')
        .setDescription('The release-tool API description')
        .setVersion('1.0')
        .addServer(process.env.BASE || '/api', 'Base URL')
        // .addBearerAuth()
        .build();
    const documentFactory = () =>
        SwaggerModule.createDocument(app, config, {
            deepScanRoutes: false,
        });
    SwaggerModule.setup('/doc', app, documentFactory);

    if (isNew) {
        await app.listen(process.env.PORT || 8000);
    }
    return app;
}

export { bootstrap as bootstrapDoc };
