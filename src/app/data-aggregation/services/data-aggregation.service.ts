import { HttpService, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule/dist/scheduler.registry';
import { CronJob } from 'cron';
import { IDataAggregationService } from './aggregation.service.interface';

@Injectable()
export class DataAggregationService implements IDataAggregationService {
    constructor(
        private httpService: HttpService,
        private schedulerRegistry: SchedulerRegistry
    ) { }

    schedulerFrequency = 10

    async getTeamSpiritRating(teamName: string): Promise<any> {
        const url = process.env.teamSpiritURL;
        console.log("HHHHHHHHHHHHHHHHHHHHHHHHH")
        console.log(url)
        const bearerToken = process.env.bearerToken;

        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`,
        };

        const response = await this.httpService.get(url + '/survey/result/' + teamName, { headers: headersRequest }).toPromise()
            .then((res: any) => {
                return res.data;
            });
        console.log("This is response");
        console.log(response)
        //return response;

    }

    async sample(teamName: string) {
        const job = new CronJob(`${this.schedulerFrequency} * * * * * *`, () => {
            // What you want to do here
            //const teamName = "zerodha"
            this.getTeamSpiritRating(teamName);
        });

        this.schedulerRegistry.addCronJob('sample', job);
        console.log("before job starts")
        job.start();
    }
}