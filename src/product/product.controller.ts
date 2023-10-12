import {
  Controller,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Post,
  Delete,
  Query,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { ProductDto } from './dto/product.dto';
import { GetAllProductData } from './dto/get-all-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // product get all
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductData) {
    return this.productService.getAll(queryDto);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id);
  }

  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.bySlug(categorySlug);
  }

  // get product one
  @Auth()
  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productService.byId(+id);
  }

  // create product
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct() {
    return this.productService.create();
  }

  // update update
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto);
  }

  // Delete product
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(+id);
  }
}
