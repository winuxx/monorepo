import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CreateProductDto, QueryProductsDto, UpdateProductDto } from './product-dto';
import { Product } from './product-model';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly model: Repository<Product>,
    ) {
        // this.model = new MongooseModel<any>(models.Product);
    }

    async create(data: CreateProductDto): Promise<Product> {
        Logger.log('Creating product', data);
        const product = this.model.create(data);
        return await this.model.save(product);
    }

    async findAll(filter: QueryProductsDto): Promise<Product[]> {
        const options = {
            where: {
                visible: null,
                name: null,
            }
        }
        if (filter.visible) {
            options.where.visible = filter.visible === 'true';
        }
        if (filter.name) {
            options.where.name = Like(`%${filter.name}%`)
        }
        Logger.log('Finding products' + JSON.stringify(options), options.where);
        return await this.model.find(options);
    }

    async findOne(id: number): Promise<Product> {
        Logger.log('Finding product', id);
        return await this.model.findOneBy({ id });
    }

    async updateOne(id: number, data: UpdateProductDto): Promise<void> {
        Logger.log('Updating product', id);
        await this.model.update(id, data);

    }

    async delete(id: number): Promise<void> {
        Logger.log('Deleting product', id);
        await this.model.delete(id);
    }
}
