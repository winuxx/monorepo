import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    InternalServerErrorException,
    Logger,
    Injectable,
    Req,
    Res,
    Bind,
    Inject,
    Delete,
    Patch,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

// import { ResBody } from '@szjj/common/src/doc/api-common-doc';

import { CreateProductDto, QueryProductsDto, UpdateProductDto } from './product-dto';
import { ProductService } from './product-service';

class ResBody {
    success: boolean;
    message?: string;
    data?: any;
}

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(@Inject('Product') private readonly service: ProductService) { }

    @Post()
    @ApiOperation({ summary: 'Create products' })
    async apply(@Body() body: CreateProductDto): Promise<ResBody> {
        Logger.log('create product', body);
        const result = await this.service.create(body);
        if (!result) {
            throw new InternalServerErrorException('NotApplyData');
        }

        return {
            success: true,
            data: result,
        };
    }

    @Get()
    @ApiOperation({ summary: 'Read products' })
    async getList(@Query() query: QueryProductsDto): Promise<ResBody> {
        Logger.log('get product list', query);
        const result = await this.service.findAll(query);
        return {
            success: true,
            data: result,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Read product' })
    @ApiParam({ name: 'id' })
    async getDetail(@Param('id') id: string): Promise<ResBody> {
        Logger.log('get product', id);
        const result = await this.service.findOne(Number(id));
        return {
            success: true,
            data: result,
        };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateProductDto })
    async update(@Param('id') id: string, @Body() body: UpdateProductDto): Promise<ResBody> {
        Logger.log('update product', id);
        await this.service.updateOne(Number(id), body);
        return { success: true }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    @ApiParam({ name: 'id' })
    async delete(@Param('id') id: string): Promise<ResBody> {
        Logger.log('delete release', id);
        await this.service.delete(Number(id));
        return {
            success: true,
        };
    }

}
