import { Controller, Get, Inject, Param ,Response} from '@nestjs/common';
import { IDataAggregationService } from '../services/aggregation.service.interface';
import { Response as eResponse } from 'express';
@Controller('data-aggregation')
export class DataAggregationController {
  constructor(@Inject('IDataAggregationService') private dataAggregationService: IDataAggregationService) {}

  @Get('team-spirit-rating/:teamId')
  async getTeamSpiritRating(@Param('teamId') teamId: string,@Response() res: eResponse) {
    console.log('reached controller team spirit');
    const result = await this.dataAggregationService.initializeAndStartTeamSpiritScheduler(teamId);
    res.status(200).json(result);
  }

  @Get('restart-team-spirit-scheduler/:teamId')
  async restartTeamSpiritScheduler(@Param('teamId') teamId: string) {
    return await this.dataAggregationService.reInitializeAndRestartTeamSpiritScheduler(teamId);
  }

  @Get('check-team-spirit-team-name/:teamName')
  async checkTeamSpiritTeamName(@Param('teamName') teamName: string, @Response() res : eResponse){
    const result = await this.dataAggregationService.checkTeamSpiritTeamName(teamName);
    res.status(200).json(result);
  }

  
}
