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
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // category get
  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }

  // update update
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(+categoryId, dto);
  }

  // Add category
  @HttpCode(200)
  @Auth()
  @Post()
  async create() {
    return this.categoryService.create();
  }

  // Delete category
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') categoryId: string) {
    return this.categoryService.delete(+categoryId);
  }
}
