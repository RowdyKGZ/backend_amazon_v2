import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CurrentUser } from 'src/auth/decorators/user.deciratirs';
import { Auth } from 'src/auth/decorators/auth.decorators';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main')
  @Auth()
  getMainStatics(@CurrentUser('id') id: number) {
    return this.statisticsService.getMain(id);
  }
}
