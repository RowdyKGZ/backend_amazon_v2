import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { returnReviewObject } from './return.review';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // Info Product
  async getAll() {
    return this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: returnReviewObject,
    });
  }

  // Create Review
  async create(userId: number, dto: ReviewDto, productId: number) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  // Average Review
  async getAverageReviewByProduct(productId: number) {
    return this.prisma.review
      .aggregate({ where: { productId }, _avg: { rating: true } })
      .then((data) => data._avg);
  }
}
