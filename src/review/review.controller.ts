import {
  Controller,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentUser } from 'src/auth/decorators/user.deciratirs';
import { ReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // review get all
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  // update update
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('leave/:productId')
  async update(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(id, dto, +productId);
  }
}
