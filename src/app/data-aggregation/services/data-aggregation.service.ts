import { HttpService, Inject, Injectable, NotAcceptableException, NotImplementedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { SchedulerRegistry } from '@nestjs/schedule/dist/scheduler.registry';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { TeamSpiritDTO } from '../../data-ingestion/model/dto/team_spiritDTO';
import { TeamSpiritMedianDTO } from '../../data-ingestion/model/dto/team_spirit_medianDTO';
import { TeamSpiritMedian } from '../../data-ingestion/model/entities/team-spirit-median.entity';
import { TeamSpirit } from '../../data-ingestion/model/entities/team-spirit.entity';
import { IDataProcessingService } from '../../data-processing/services/data-processing.service.interface';
import { IDataAggregationService } from './aggregation.service.interface';
import * as defaults from '../../shared/constants/constants';
import { IDataIngestionService } from '../../data-ingestion/services/data-ingestion.service.interface';
//const cron = require('node-cron');
@Injectable()
export class DataAggregationService implements IDataAggregationService {
  constructor(
    private httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('IDataProcessingService') private readonly dataProcessingService: IDataProcessingService,
    @Inject('IDataIngestionService') private readonly dataIngestionService: IDataIngestionService,
    @InjectRepository(TeamSpirit) private readonly teamSpiritRepository: Repository<TeamSpirit>,
    @InjectRepository(TeamSpiritMedian) private readonly teamSpiritMedianRepository: Repository<TeamSpiritMedian>,
  ) {}

  schedulerFrequency = 10;

  private async loginToTeamSpiritApplication(): Promise<string> {
    try {
      const url = process.env.teamSpiritURL;
      const teamSpiritLoginDTO = {
        email: process.env.teamSpiritUserEmail,
        password: process.env.teamSpiritUserPassword,
      };
      const accessToken = await this.httpService
        .post(url + '/login', teamSpiritLoginDTO)
        .toPromise()
        .then((res: any) => {
          return res.data.token;
        });
      return accessToken;
    } catch (E) {
      //  console.log('Unable to login to Team Spirit, Try Again');
      throw new NotAcceptableException('Unable to login to Team Spirit, Try Again');
    }
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

  async checkTeamSpiritTeamName(teamName: string): Promise<any> {
    try {
      const accessToken: any = await this.loginToTeamSpiritApplication();
      const teamDetails: any = await this.getTeamDetailsFromTeamSpirit(teamName, accessToken);
      if (teamDetails) return teamDetails;
      else throw new NotFoundException('Team name Not Found in Team Spirit Application');
    } catch (E) {
      throw new NotFoundException('Team name Not Found in Team Spirit Application');
    }
  }

  async getTeamSpiritRating(teamSpirit: TeamSpiritDTO): Promise<any> {
    try {
      const accessToken = this.loginToTeamSpiritApplication();
      const url = process.env.teamSpiritURL;
      const headersRequest = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      };

      const response = await this.httpService
        .get(url + '/survey/result/' + teamSpirit.teamName, { headers: headersRequest })
        .toPromise()
        .then((res: any) => {
          return res.data;
        });

      teamSpirit.surveyMedian = response.CurrentResult;
      this.saveTeamSpiritRatingInDb(teamSpirit);
      return response;
    } catch (E) {
      console.log(E);
    }
  }

  private async saveTeamSpiritRatingInDb(teamSpiritResponseData: TeamSpiritDTO) {
    try {
      let teamSpirit: TeamSpiritMedianDTO = new TeamSpiritMedianDTO();
      teamSpirit.surveyCode = teamSpiritResponseData.surveyCode;
      teamSpirit.startDate = teamSpiritResponseData.startDate;
      teamSpirit.endDate = teamSpiritResponseData.endDate;
      teamSpirit.surveyMedian = teamSpiritResponseData.surveyMedian;
      teamSpirit.teamId = teamSpiritResponseData.teamId;
      return this.dataProcessingService.processJSON(teamSpirit, teamSpirit.teamId, 'teamspirit');
    } catch (E) {
      console.log(E);
    }
  }

  async getTeamSpiritDetails(teamId: string): Promise<TeamSpiritDTO> {
    const accessToken: any = await this.loginToTeamSpiritApplication();

    const teamSpiritTeamName: TeamSpirit = (await this.teamSpiritRepository
      .createQueryBuilder('team_spirit')
      .where('team_spirit.team_id=:team_id', { team_id: teamId })
      .take(1)
      .getOne()) as TeamSpirit;

    if (teamSpiritTeamName) {
      try {
        const teamDetails: any = await this.getTeamDetailsFromTeamSpirit(teamSpiritTeamName.teamName, accessToken);

        if (teamDetails) {
          teamDetails.Surveys.sort(function (a: any, b: any) {
            var c: Date = new Date(a.EndDate);
            var d: Date = new Date(b.EndDate);
            if (c < d) {
              return 1;
            } else if (c > d) {
              return -1;
            } else return 0;
          });
          let today: Date = new Date();
          let lastSurvey: any = null;
          for (let survey of teamDetails.Surveys) {
            if (new Date(survey.EndDate) < today) {
              lastSurvey = survey;
            }
          }
          if (lastSurvey == null) {
            if (teamDetails.Surveys.length > 0) {
              lastSurvey = teamDetails.Surveys[0];
            } else {
              throw new NotImplementedException('No Surveys Found');
            }
          }
          const frequency: number = teamDetails.Frequency;

          let scheduledDate: Date = new Date(lastSurvey.EndDate);

          do {
            if (today > scheduledDate) {
              scheduledDate.setDate(scheduledDate.getDate() + frequency);
            }
          } while (today > scheduledDate);
          console.log('Scheduled Dattttttteeeeeeeeee');
          console.log(scheduledDate);
          let teamSpirit: TeamSpiritDTO = new TeamSpiritDTO();
          teamSpirit.teamId = teamId;
          teamSpirit.startDate = lastSurvey.StartDate;
          teamSpirit.endDate = lastSurvey.EndDate;
          teamSpirit.surveyCode = lastSurvey.Code;
          teamSpirit.scheduledDate = scheduledDate;
          teamSpirit.frequency = frequency;
          teamSpirit.accessToken = accessToken;
          teamSpirit.teamName = teamSpiritTeamName.teamName;
          return teamSpirit;
        }
      } catch (E) {
        //   console.log(E);
        //  console.log('Team not found in Team Spirit Application');
        throw new NotFoundException('Team not found in Team Spirit Application');
      }
    } else {
      // console.log('Team Spirit Team Name Not Found');
      throw new NotFoundException('Team Spirit Team Name Not Found');
    }
    // console.log('Unable to run Cron Job for TeamSpirit');
    throw new NotAcceptableException('Unable to run Cron Job for TeamSpirit');
  }

  async initializeAndStartTeamSpiritScheduler(teamId: string) {
    try {
      console.log('started team spirit cron job========================');
      let teamSpirit: TeamSpiritDTO = await this.getTeamSpiritDetails(teamId);
      let today: Date = new Date();
      let endDate: Date = new Date(teamSpirit.endDate);
      if (today > endDate) {
        await this.checkLastSurveyInDatabaseAndProceed(teamSpirit, teamId);
      }
      //console.log(teamSpirit.scheduledDate.toString());
      let tempFrequency = teamSpirit.frequency * 24;
      let schedulerFrequency = '0 */' + tempFrequency + ' * * *';
      let firstFetch: string = defaults.team_spirit_first_fetch + teamId;
      let repeatFetch: string = defaults.team_spirit_repetetive_fetch + teamId;
      const repetetiveJob = new CronJob(schedulerFrequency, async () => {
        console.log('2nd cron job');
        let latestTeamSpirit: TeamSpiritDTO = await this.getTeamSpiritDetails(teamId);
        await this.checkLastSurveyInDatabaseAndProceed(latestTeamSpirit, teamId);
      });
      const job = new CronJob(teamSpirit.scheduledDate, async () => {
        console.log('Inside first cron job------------');
        let latestTeamSpirit: TeamSpiritDTO = await this.getTeamSpiritDetails(teamId);
        await this.checkLastSurveyInDatabaseAndProceed(latestTeamSpirit, teamId);
        this.schedulerRegistry.addCronJob(repeatFetch, repetetiveJob);
        repetetiveJob.start();
        job.stop();
      });

      this.schedulerRegistry.addCronJob(firstFetch, job);
      console.log('before job starts');
      job.start();
      await this.dataIngestionService.registerCronJob('Running', 'Team_Spirit', teamId);
    } catch (E) {
      return E;
    }
  }
  async checkLastSurveyInDatabaseAndProceed(teamSpirit: TeamSpiritDTO, teamId: string) {
    let teamSpiritMedian: TeamSpiritMedian = (await this.teamSpiritMedianRepository
      .createQueryBuilder('team_spirit_median')
      .where('team_spirit_median.team_id=:team_id', { team_id: teamId })
      .orderBy('team_spirit_median.end_date', 'DESC')
      .getOne()) as TeamSpiritMedian;
    if (teamSpiritMedian) {
      if (new Date(teamSpiritMedian.endDate).getTime() == new Date(teamSpirit.endDate).getTime()) {
        console.log('Already Updated');
      } else {
        this.getTeamSpiritRating(teamSpirit);
      }
    } else {
      this.getTeamSpiritRating(teamSpirit);
    }
  }

  async reInitializeAndRestartTeamSpiritScheduler(teamId: string) {
    try {
      console.log('team Spirit cron job restarted.....................');
      let firstFetch: string = defaults.team_spirit_first_fetch + teamId;
      let repeatFetch: string = defaults.team_spirit_repetetive_fetch + teamId;
      const job = this.schedulerRegistry.getCronJob(firstFetch);
      if (job) {
        job.stop();
      }
      const repetetiveJob = this.schedulerRegistry.getCronJob(repeatFetch);
      if (repetetiveJob) {
        repetetiveJob.stop();
      }

      console.log('check is updated');
      console.log(teamId);
      this.initializeAndStartTeamSpiritScheduler(teamId);
    } catch (E) {
      console.log('Cannot restart Team Spirit Cron Job');
      throw new NotAcceptableException('Cannot restart Team Spirit Cron Job');
    }

    // job.start();
  }
}
