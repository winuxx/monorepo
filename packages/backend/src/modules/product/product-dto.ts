import { ApiProperty } from '@nestjs/swagger';
// import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ type: String, description: 'Name', required: true, default: '' })
    name: string;

    @ApiProperty({ type: Number, description: 'Price', required: false, default: null })
    price?: number;

    @ApiProperty({ type: Number, description: 'Qty', required: false, default: null })
    qty?: number;

    @ApiProperty({ type: Boolean, description: 'Visible', required: false, default: true })
    visible?: boolean;
}

export class UpdateProductDto {
    @ApiProperty({ type: Number, description: 'Price', required: false, default: null })
    price?: number;

    @ApiProperty({ type: Number, description: 'Qty', required: false, default: null })
    qty?: number;

    @ApiProperty({ type: Boolean, description: 'Visible', required: false, default: true })
    visible?: boolean;
}

export class QueryProductsDto {
    @ApiProperty({ type: String, description: 'Name', required: false, default: '' })
    name?: string;

    @ApiProperty({ type: String, description: 'Visible', required: false, default: null })
    visible?: string;
}
