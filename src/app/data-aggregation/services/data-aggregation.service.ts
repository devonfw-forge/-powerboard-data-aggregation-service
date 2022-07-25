import { HttpService, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { SchedulerRegistry } from '@nestjs/schedule/dist/scheduler.registry';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { Team } from '../../data-ingestion/model/entities/team.entity';
import { IDataProcessingService } from '../../data-processing/services/data-processing.service.interface';
import { IDataAggregationService } from './aggregation.service.interface';
//const cron = require('node-cron');
@Injectable()
export class DataAggregationService implements IDataAggregationService {
  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('IDataProcessingService') private readonly dataProcessingService: IDataProcessingService,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}

  schedulerFrequency = 10;

  private async loginToTeamSpiritApplication(): Promise<string> {
    const url = process.env.teamSpiritURL;
    const teamSpiritLoginDTO = {
      email: process.env.teamSpiritUserEmail,
      password: process.env.teamSpiritUserPassword,
    };
    const accessToken = await this.httpService
      .post(url + '/login', teamSpiritLoginDTO)
      .toPromise()
      .then((res: any) => {
        console.log('response data');
        console.log(res.data);
        return res.data.token;
      });

    return accessToken;
  }

  async getTeamDetailsFromTeamSpirit(teamName: string, accessToken: string): Promise<any> {
    const url = process.env.teamSpiritURL;
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };
    const response = await this.httpService
      .get(url + '/team/' + teamName, { headers: headersRequest })
      .toPromise()
      .then((res: any) => {
        return res.data;
      });
    return response;
  }
  async getTeamSpiritRating(teamName: string, accessToken: string): Promise<any> {
    // const accessToken = this.loginToTeamSpiritApplication();

    const url = process.env.teamSpiritURL;
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    const response = await this.httpService
      .get(url + '/survey/result/' + teamName, { headers: headersRequest })
      .toPromise()
      .then((res: any) => {
        return res.data;
      });
    console.log('This is response');
    console.log(response);
    this.saveTeamSpiritRatingInDb(response, teamName);
    //return response;
  }
  private async saveTeamSpiritRatingInDb(teamSpiritResponseData: any, teamName: string) {
    const team = (await this.teamRepository.findOne({ where: { name: teamName } })) as Team;
    if (team) {
      return this.dataProcessingService.processJSON(teamSpiritResponseData, team.id, 'teamspirit');
    } else {
      throw new NotFoundException('Team Not Found in Powerboard DB');
    }
  }

  async initializeAndStartTeamSpiritScheduler(teamName: string) {
    const accessToken: any = await this.loginToTeamSpiritApplication();
    const teamDetails: any = await this.getTeamDetailsFromTeamSpirit(teamName, accessToken);
    const lastSurvey = teamDetails.Surveys.reduce((a: any, b: any) => (a.EndDate > b.EndDate ? a : b));
    console.log(lastSurvey);
    let scheduledDate: Date = new Date(lastSurvey.EndDate);
    // let scheduledDate: Date = new Date("2022-03-30T10:26:00.000Z");
    console.log('Scheduled Dattttttteeeeeeeeee');
    //  console.log(scheduledDate)
    console.log(scheduledDate.toString());
    const job = new CronJob(scheduledDate, () => {
      console.log('Inside cron job');
      this.getTeamSpiritRating(teamName, accessToken);
    });

    this.schedulerRegistry.addCronJob('FetchTeamRating', job);
    console.log('before job starts');
    job.start();
  }

  async reInitializeAndRestartTeamSpiritScheduler(teamName: string) {
    const job = this.schedulerRegistry.getCronJob('FetchTeamRating');

    job.stop();

    console.log('check is updated');
    console.log(teamName);
    this.initializeAndStartTeamSpiritScheduler(teamName);
    // job.start();
  }
}
