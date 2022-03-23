import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IDataAggregationService } from '../services/aggregation.service.interface';

@Controller('data-aggregation')
export class DataAggregationController {
    constructor(
        @Inject('IDataAggregationService') private dataAggregationService: IDataAggregationService,
        // private schedulerRegistry: SchedulerRegistry
    ) { }
    //@Cron('45 * * * * *')

    schedulerFrequency = '10'
    // @Cron(CronExpression.EVERY_10_HOURS)
    // @Cron(schedulerFrequency)
    @Get('teamSpiritRating/:teamName')
    async getTeamSpiritRating(@Param('teamName') teamName: string) {
        return await this.dataAggregationService.sample(teamName);
    }

    // async sample() {
    //     const job = new CronJob(this.schedulerFrequency, () => {
    //         // What you want to do here
    //         const teamName = "zerodha"
    //         this.getTeamSpiritRating(teamName);
    //     });

    //     this.schedulerRegistry.addCronJob('sample', job);
    //     job.start();
    // }
}
