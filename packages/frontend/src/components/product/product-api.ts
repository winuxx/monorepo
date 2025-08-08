import { CreateProductDto, UpdateProductDto } from '@packages/backend/src/modules/product/product-dto'

import request from '@/common/api'

export async function getProducts(query: Record<string, any> = {}) {
    const url = '/product'
    return await request(
        {
            method: 'get',
            url,
            query,
        },
        {
            prompts: {
                fail: { title: 'get products failed' },
            },
        }
    )
}

export async function addProduct(data: CreateProductDto) {
    const url = '/product'
    return await request(
        {
            method: 'post',
            url,
            data,
        },
        {
            prompts: {
                success: { title: 'create product success' },
                fail: { title: 'create product failed' },
            },
        }
    )
}

export async function editProduct(id: number, data: UpdateProductDto) {
    const url = `/product/${id}`
    return await request(
        {
            method: 'patch',
            url,
            data,
        },
        {
            prompts: {
                success: { title: 'update product success' },
                fail: { title: 'update product failed' },
            },
        }
    )
}
