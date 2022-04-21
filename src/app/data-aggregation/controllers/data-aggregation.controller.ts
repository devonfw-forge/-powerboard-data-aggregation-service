import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IDataAggregationService } from '../services/aggregation.service.interface';

@Controller('data-aggregation')
export class DataAggregationController {
  constructor(@Inject('IDataAggregationService') private dataAggregationService: IDataAggregationService) {}

  @Get('team-spirit-rating/:teamName')
  async getTeamSpiritRating(@Param('teamName') teamName: string) {
    console.log(teamName);
    return await this.dataAggregationService.initializeAndStartTeamSpiritScheduler(teamName);
  }

  @Get('restart-team-spirit-scheduler/:teamName')
  async restartTeamSpiritScheduler(@Param('teamName') teamName: string) {
    return await this.dataAggregationService.reInitializeAndRestartTeamSpiritScheduler(teamName);
  }
}
