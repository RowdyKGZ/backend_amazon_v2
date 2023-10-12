import { Injectable } from '@nestjs/common';
import { PaginationDto } from './pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPage = 30) {
    const page = dto.page ? +dto.page : 1;
    const prePage = dto.perPage ? +dto.perPage : defaultPage;

    const skip = (page - 1) * prePage;

    return { prePage, skip };
  }
}
