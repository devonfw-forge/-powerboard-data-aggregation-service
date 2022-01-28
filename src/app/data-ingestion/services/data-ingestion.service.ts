import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Group } from '../../file-and-json-processing/models/group';
import { CodeQualitySnapshot } from '../model/entities/code-quality-snapshot.entity';
import { Sprint } from '../model/entities/sprint.entity';
import { SprintSnapshot } from '../model/entities/sprintSnapshot.entity';
import { SprintSnapshotMetric } from '../model/entities/sprintSnapshotMetric.entity';
import { SprintMetric } from '../model/entities/sprint_metric.entity';
import { SprintStatus } from '../model/entities/sprint_status.entity';
import { SprintWorkUnit } from '../model/entities/sprint_work_unit.entity';
import { Team } from '../model/entities/team.entity';
//import { Team } from '../model/entities/team.entity';

import { IDataIngestionService } from './data-ingestion.service.interface';

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
  ) {
    super(sprintRepository);
  }

  async ingest(processedJson: Group[], teamId: string): Promise<any> {
    let sprintArray: Sprint[] = [];
    for (let group of processedJson) {
      let sprint: Sprint = {} as Sprint;
      let sprintSnapshotMetricValue: string = '';
      let sprintMetric: SprintMetric = {} as SprintMetric;
      //let index = 0;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        // index = Number(splittedKeys[splittedKeys.length - 2]);
        // if (sprintArray.length === index - 1) {
        //   console.log(index);
        //   sprintArray[index - 1] = sprint;
        //   sprint = {} as Sprint
        // }
        if (actualKey === 'id') {
          sprint.sprint_number = Number(object.value);
        }
        if (actualKey === 'startDate') {
          sprint.start_date = object.value;
        }
        if (actualKey === 'state') {
          if (object.value === 'active') {
            object.value = 'Completed';
          } else {
            object.value = 'In Progress';
          }
          const sprintStatus = await this.sprintStatusRepository.findOne({ where: { status: object.value } });
          sprint.status = sprintStatus!.id;
        }
        if (actualKey === 'endDate') {
          sprint.end_date = object.value;
        }
        if (actualKey === 'workUnit') {
          const sprintWorkUnit = await this.sprintWorkUnitRepository.findOne({ where: { work_unit: object.value } });
          console.log('workkkk unitttt');
          console.log(sprintWorkUnit);
          sprint.work_unit = sprintWorkUnit!.id;
        }
        if (actualKey === 'value') {
          sprintSnapshotMetricValue = object.value;
        }
        if (actualKey === 'metric') {
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
    //let sprintSnapshotArray: SprintSnapshot[] = [];

    let sprintSnapshot: SprintSnapshot = {} as SprintSnapshot;
    sprintSnapshot.sprint = sprint;
    sprintSnapshot.date_time = sprint.start_date;
    //sprintSnapshotArray.push(sprintSnapshot);

    return sprintSnapshot;
  }

  async ingestCodeQuality(processedJson: Group[], teamId: string) {
    console.log(teamId);
    let codeQualityArray: CodeQualitySnapshot[] = [] as CodeQualitySnapshot[];
    for (let group of processedJson) {
      console.log('*************');
      console.log(group);
      //let sprint: Sprint = {} as Sprint;
      let codeQuality: CodeQualitySnapshot = {} as CodeQualitySnapshot;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === 'bugs') {
          codeQuality.bugs = Number(object.value);
        }
        if (actualKey === 'key') {
          codeQuality.id = object.value;
        }
        if (actualKey === 'codeSmells') {
          codeQuality.codeSmells = Number(object.value);
        }
        if (actualKey === 'codeCoverage') {
          codeQuality.code_coverage = Number(object.value);
        }
        if (actualKey === 'qualityGateStatus') {
          codeQuality.status = object.value;
        }
        if (actualKey === 'analysisDate') {
          codeQuality.snapshot_time = object.value;
        }
      }
      let team = await this.teamRepository.findOne(teamId);
      if (team) {
        codeQuality.team = team;
      }
      codeQualityArray.push(codeQuality);
    }

    return codeQualityArray;
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
