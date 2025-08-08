import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as controllers from './product-controller';
import { Product } from './product-model';
import * as providers from './product-service';


@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [controllers.ProductController], // Object.values(controllers),
    providers: [
        {
            provide: 'Product',
            useClass: providers.ProductService,
        },
    ],
})
export class ProductModule { }
