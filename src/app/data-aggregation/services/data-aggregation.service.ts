import { HttpService, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { SchedulerRegistry } from '@nestjs/schedule/dist/scheduler.registry';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { Team } from '../../data-ingestion/model/entities/team.entity';
import { IDataProcessingService } from '../../data-processing/services/data-processing.service.interface';
import { IDataAggregationService } from './aggregation.service.interface';

@Injectable()
export class DataAggregationService implements IDataAggregationService {
    constructor(
        private httpService: HttpService,
        private schedulerRegistry: SchedulerRegistry,
        @Inject('IDataIngestionService') private readonly dataProcessingService: IDataProcessingService,
        @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    ) { }

    schedulerFrequency = 10

    private async getTeamSpiritRating(teamName: string): Promise<any> {
        const url = process.env.teamSpiritURL;
        const teamSpiritLoginDTO = {
            email: process.env.teamSpiritUserEmail,
            password: process.env.teamSpiritUserPassword
        }
        const accessToken = await this.httpService.post(url + '/login', teamSpiritLoginDTO).toPromise()
            .then((res: any) => {
                console.log('response data');
                console.log(res.data)
                return res.data.token;
            });

        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        };

        const response = await this.httpService.get(url + '/survey/result/' + teamName, { headers: headersRequest }).toPromise()
            .then((res: any) => {
                return res.data;
            });
        console.log("This is response");
        console.log(response)
        this.saveTeamSpiritRatingInDb(response, teamName);
        //return response;

    }
    private async saveTeamSpiritRatingInDb(teamSpiritResponseData: any, teamName: string) {
        const team = await this.teamRepository.findOne({ where: { name: teamName } }) as Team;
        if (team) {
            return this.dataProcessingService.processJSON(teamSpiritResponseData, team.id, 'teamspirit')
        } else {
            throw new NotFoundException('Team Not Found in Powerboard DB');
        }

    }

    async initializeAndStartTeamSpiritScheduler(teamName: string) {
        const job = new CronJob(` ${this.schedulerFrequency} * * * * *`, () => {
            // What you want to do here
            //const teamName = "zerodha"
            this.getTeamSpiritRating(teamName);
        });

        this.schedulerRegistry.addCronJob('FetchTeamRating', job);
        console.log("before job starts")
        job.start();
    }

    async reInitializeAndRestartTeamSpiritScheduler(teamName: string) {
        const job = this.schedulerRegistry.getCronJob('FetchTeamRating');

        job.stop();

        console.log('check is updated');
        console.log(teamName)
        this.initializeAndStartTeamSpiritScheduler(teamName)
        // job.start();
    }
}