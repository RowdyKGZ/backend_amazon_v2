import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { returnProductObjectFullest } from './return-product.object';
import { PaginationService } from 'src/pagination/pagination.service';
import { EnumProductSort, GetAllProductData } from './dto/get-all-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  // Info Products
  async getAll(dto: GetAllProductData = {}) {
    const { sort, searchThem } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) {
      prismaSort.push({ price: 'asc' });
    } else if (sort === EnumProductSort.HIGH_PRICE) {
      prismaSort.push({ price: 'desc' });
    } else if (sort === EnumProductSort.OLDEST) {
      prismaSort.push({ createdAt: 'asc' });
    } else {
      prismaSort.push({ createdAt: 'desc' });
    }

    const prismaSerachThermFilter: Prisma.ProductWhereInput = searchThem
      ? {
          OR: [
            {
              category: { name: { contains: searchThem, mode: 'insensitive' } },
            },
            {
              name: { contains: searchThem, mode: 'insensitive' },
            },
            {
              description: { contains: searchThem, mode: 'insensitive' },
            },
          ],
        }
      : {};

    const { prePage, skip } = this.paginationService.getPagination(dto);

    const product = await this.prisma.product.findMany({
      where: prismaSerachThermFilter,
      orderBy: prismaSort,
      skip,
      take: prePage,
    });

    return {
      product,
      length: await this.prisma.product.findMany({
        where: prismaSerachThermFilter,
      }),
    };
  }

  // get product
  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: returnProductObjectFullest,
    });

    if (!product) {
      throw new NotFoundException(`product not found`);
    }

    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: returnProductObjectFullest,
    });

    if (!product) {
      throw new NotFoundException(`product not found`);
    }

    return product;
  }

  // get category product
  async byCategory(categorySlug: string) {
    const product = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      select: returnProductObjectFullest,
    });

    if (!product) {
      throw new NotFoundException(`product not found`);
    }

    return product;
  }

  // get category product recomendations
  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);
    if (!currentProduct) {
      throw new NotFoundException('Current product not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        category: { name: currentProduct.category.name },
        NOT: { id: currentProduct.id },
      },
      orderBy: { createdAt: 'desc' },
      select: returnProductObject,
    });

    return products;
  }

  // Create product
  async create() {
    const product = await this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: '',
      },
    });

    return product.id;
  }

  // Update product
  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: generateSlug(dto.name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  // Delete product
  async delete(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
