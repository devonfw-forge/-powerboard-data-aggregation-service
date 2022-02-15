import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Group } from '../../file-and-json-processing/models/group';
import { ClientStatus } from '../model/entities/client-status.entity';
import { CodeQualitySnapshot } from '../model/entities/code-quality-snapshot.entity';
import { Sprint } from '../model/entities/sprint.entity';
import { SprintSnapshot } from '../model/entities/sprintSnapshot.entity';
import { SprintSnapshotMetric } from '../model/entities/sprintSnapshotMetric.entity';
import { SprintMetric } from '../model/entities/sprint_metric.entity';
import { SprintStatus } from '../model/entities/sprint_status.entity';
import { SprintWorkUnit } from '../model/entities/sprint_work_unit.entity';
import { TeamSpirit } from '../model/entities/team-spirit.entity';
import { Team } from '../model/entities/team.entity';
import { IDataIngestionService } from './data-ingestion.service.interface';
import * as defaults from '../../shared/constants/constants';
@Injectable()
export class DataIngestionService extends TypeOrmCrudService<Sprint> implements IDataIngestionService {
  constructor(
    @InjectRepository(Sprint) private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(SprintStatus) private readonly sprintStatusRepository: Repository<SprintStatus>,
    @InjectRepository(SprintMetric) private readonly sprintMetricRepository: Repository<SprintMetric>,
    @InjectRepository(SprintSnapshotMetric)
    private readonly sprintSnapshotMetricRepository: Repository<SprintSnapshotMetric>,
    @InjectRepository(SprintWorkUnit) private readonly sprintWorkUnitRepository: Repository<SprintWorkUnit>,
    @InjectRepository(SprintSnapshot) private readonly sprintSnapshotRepository: Repository<SprintSnapshot>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectRepository(CodeQualitySnapshot)
    private readonly codeQualitySnapshotRepository: Repository<CodeQualitySnapshot>,
    @InjectRepository(TeamSpirit)
    private readonly teamSpiritRepository: Repository<TeamSpirit>,
    @InjectRepository(ClientStatus)
    private readonly clientStatusRepository: Repository<ClientStatus>,
  ) {
    super(sprintRepository);
  }

  async ingestTeamSpirit(processedJson: Group[], teamId: string) {
    for (let group of processedJson) {
      let teamSpirit: TeamSpirit = {} as TeamSpirit;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.teamSpiritRating) {
          teamSpirit.team_spirit_rating = Number(object.value);
        }
      }

      const activeSprint: any = (await this.sprintRepository
        .createQueryBuilder('sprint')
        .addSelect('sprint.id')
        .addSelect('st.status')
        .innerJoin(SprintStatus, 'st', 'st.id=sprint.status')
        .where('sprint.team_id =:team_Id', { team_Id: teamId })
        .andWhere('sprint.status=:status', { status: '11155bf2-ada5-495c-8019-8d7ab76d488e' })
        .getRawOne()) as Sprint;
      teamSpirit.sprint = activeSprint;
      const savedEntity = await this.persistTeamSpiritEntity(teamSpirit);

      return savedEntity;
    }
  }

  async persistTeamSpiritEntity(teamSpirit: TeamSpirit) {
    return await this.teamSpiritRepository.save(teamSpirit);
  }

  async ingestClientStatus(processedJson: Group[], teamId: string) {
    for (let group of processedJson) {
      let clientSatus: ClientStatus = {} as ClientStatus;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.clientRating) {
          clientSatus.client_rating = Number(object.value);
        }
      }
      const activeSprint: any = (await this.sprintRepository
        .createQueryBuilder('sprint')
        .addSelect('sprint.id')
        .addSelect('st.status')
        .innerJoin(SprintStatus, 'st', 'st.id=sprint.status')
        .where('sprint.team_id =:team_Id', { team_Id: teamId })
        .andWhere('sprint.status=:status', { status: '11155bf2-ada5-495c-8019-8d7ab76d488e' })
        .getRawOne()) as Sprint;

      clientSatus.sprint = activeSprint;
      const savedEntity = await this.persistClientStatusEntity(clientSatus);

      return savedEntity;
    }
  }
  async persistClientStatusEntity(clientStatus: ClientStatus) {
    return await this.clientStatusRepository.save(clientStatus);
  }

  async ingestJira(processedJson: Group[], teamId: string): Promise<any> {
    let sprintArray: Sprint[] = [];
    for (let group of processedJson) {
      let sprint: Sprint = {} as Sprint;
      let sprintSnapshotMetricValue: string = '';
      let sprintMetric: SprintMetric = {} as SprintMetric;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.id) {
          sprint.sprint_number = Number(object.value);
        }
        if (actualKey === defaults.startDate) {
          sprint.start_date = object.value;
        }
        if (actualKey === defaults.state) {
          if (object.value === 'active') {
            object.value = 'Completed';
          } else {
            object.value = 'In Progress';
          }
          const sprintStatus = await this.sprintStatusRepository.findOne({ where: { status: object.value } });
          sprint.status = sprintStatus!.id;
        }
        if (actualKey === defaults.endDate) {
          sprint.end_date = object.value;
        }
        if (actualKey === defaults.workUnit) {
          const sprintWorkUnit = await this.sprintWorkUnitRepository.findOne({ where: { work_unit: object.value } });
          sprint.work_unit = sprintWorkUnit!.id;
        }
        if (actualKey === defaults.value) {
          sprintSnapshotMetricValue = object.value;
        }
        if (actualKey === defaults.metric) {
          const sprintMetricObj = await this.sprintMetricRepository.findOne({ where: { name: object.value } });
          if (sprintMetricObj !== undefined) {
            sprintMetric = sprintMetricObj;
          }
        }
      }
      const team = await this.teamRepository.findOne({ where: { id: teamId } });
      sprint.team = team!;
      sprintArray.push(sprint);

      const result = await this.persistEntities(sprint, sprintSnapshotMetricValue, sprintMetric);
      console.log(result);
    }

    return sprintArray;
  }
  async persistEntities(sprint: Sprint, sprintSnapshotMetricValue: string, sprintMetric: SprintMetric) {
    const sprintCreated = await this.sprintRepository.save(sprint);

    let sprintSnapshotMetricSaved;
    if (sprintCreated) {
      const sprintSnapshot = this.createSprintSnapshotEntity(sprintCreated);
      const sprintSnapshotSaved = await this.sprintSnapshotRepository.save(sprintSnapshot);
      if (sprintSnapshotSaved) {
        const sprintSnapshotMetric = await this.createSprintSnapshotMetricEntity(
          sprintSnapshotMetricValue,
          sprintSnapshotSaved,
          sprintMetric,
        );
        sprintSnapshotMetricSaved = await this.sprintSnapshotMetricRepository.save(sprintSnapshotMetric);
      }
    }
    if (sprintSnapshotMetricSaved) {
      return 'success';
    } else {
      return 'failure';
    }
  }

  async createSprintSnapshotMetricEntity(value: string, sprintSnapshot: SprintSnapshot, sprintMetric: SprintMetric) {
    let sprintSnapshotMetric: SprintSnapshotMetric = {} as SprintSnapshotMetric;
    sprintSnapshotMetric.value = value;
    sprintSnapshotMetric.snapshot = sprintSnapshot;
    sprintSnapshotMetric.metric = sprintMetric;
    return sprintSnapshotMetric;
  }

  createSprintSnapshotEntity(sprint: Sprint): SprintSnapshot {
    let sprintSnapshot: SprintSnapshot = {} as SprintSnapshot;
    sprintSnapshot.sprint = sprint;
    sprintSnapshot.date_time = sprint.start_date;
    return sprintSnapshot;
  }

  async ingestCodeQuality(processedJson: Group[], teamId: string) {
    let codeQualityArray: CodeQualitySnapshot[] = [] as CodeQualitySnapshot[];
    for (let group of processedJson) {
      let codeQuality: CodeQualitySnapshot = {} as CodeQualitySnapshot;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.bugs) {
          codeQuality.bugs = Number(object.value);
        }
        if (actualKey === defaults.codeSmells) {
          codeQuality.codeSmells = Number(object.value);
        }
        if (actualKey === defaults.codeCoverage) {
          codeQuality.code_coverage = Number(object.value);
        }
        if (actualKey === defaults.qualityGateStatus) {
          codeQuality.status = object.value;
        }
        if (actualKey === defaults.analysisDate) {
          codeQuality.snapshot_time = object.value;
        }
      }
      let team = await this.teamRepository.findOne(teamId);

      if (team) {
        codeQuality.team = team;
      }

      const codeQualitySnapshotSaved = await this.persistCodeQuality(codeQuality);

      codeQualityArray.push(codeQualitySnapshotSaved);
    }

    return codeQualityArray;
  }

  async persistCodeQuality(codeQualityEntity: CodeQualitySnapshot) {
    return this.codeQualitySnapshotRepository.save(codeQualityEntity);
  }

  async findTeamUsingTeamId(teamId: string): Promise<string | Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (team) {
      return team;
    } else {
      return 'team not found';
    }
  }
}
