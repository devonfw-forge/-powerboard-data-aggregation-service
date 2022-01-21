import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Group } from '../../file-and-json-processing/models/group';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm/repository/Repository';
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
          // console.log(object.value);
          sprint.sprint_number = Number(object.value);
        }
        if (actualKey === 'startDate') {
          // console.log(object.value);
          sprint.start_date = object.value;
        }
        if (actualKey === 'state') {
          // console.log(object.value);

          if (object.value === 'active') {
            object.value = 'Completed';
          } else {
            object.value = 'In Progress';
          }
          const sprintStatus = await this.sprintStatusRepository.findOne({ where: { status: object.value } });
          sprint.status = sprintStatus!.id;
        }
        if (actualKey === 'endDate') {
          // console.log(object.value);
          sprint.end_date = object.value;
        }
        if (actualKey === 'workUnit') {
          // console.log(object.value);
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
          console.log('Testtttttttttttttttt');
          console.log(sprintMetricObj);
          if (sprintMetricObj !== undefined) {
            sprintMetric = sprintMetricObj;
          }
        }
      }
      const team = await this.teamRepository.findOne({ where: { id: teamId } });
      sprint.team = team!;
      sprintArray.push(sprint);

      // const sprintSnapshot = this.createSprintSnapshotEntity(sprint);
      // console.log(sprint);
      // console.log("#@@@@@@@@@@@@@@@@@@@@@@@")
      // console.log(sprintSnapshot);
      // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%")
      // const sprintSnapshotMetric = await this.createSprintSnapshotMetricEntity(
      //   sprintSnapshotMetricValue,
      //   sprintSnapshot,
      //   sprintMetric,
      // );

      // console.log(sprintSnapshotMetric);

      //  console.log(sprintSnapshotMetric);

      const result = await this.persistEntities(sprint, sprintSnapshotMetricValue, sprintMetric);
      console.log(result);
      // console.log(sprint);
    }
    //await this.sprintRepository.findOne('20155bf8-ada5-495c-8019-8d7ab76d488e');
    // console.log(sprintArray);

    return sprintArray;
  }
  async persistEntities(sprint: Sprint, sprintSnapshotMetricValue: string, sprintMetric: SprintMetric) {
    const sprintCreated = await this.sprintRepository.save(sprint);
    console.log('GGGGGGGGGGGGGGGGGGGGGGG');
    console.log(sprintCreated);
    let sprintSnapshotMetricSaved;
    if (sprintCreated) {
      console.log('sprint snapshottttt');

      const sprintSnapshot = this.createSprintSnapshotEntity(sprintCreated);

      const sprintSnapshotSaved = await this.sprintSnapshotRepository.save(sprintSnapshot);
      console.log(sprintSnapshotSaved);
      if (sprintSnapshotSaved) {
        const sprintSnapshotMetric = await this.createSprintSnapshotMetricEntity(
          sprintSnapshotMetricValue,
          sprintSnapshotSaved,
          sprintMetric,
        );
        console.log('metriccccccccccc');
        console.log(sprintSnapshotMetric);
        sprintSnapshotMetricSaved = await this.sprintSnapshotMetricRepository.save(sprintSnapshotMetric);
      }
    }
    if (sprintSnapshotMetricSaved) {
      return 'success';
    } else {
      return 'failure';
    }
    // console.log(sprintCreated);
    // let sprintSnapshotMetricSaved;
    // if (sprintCreated) {
    //   const sprintSnapshotSaved = await this.sprintSnapshotRepository.save(sprintSnapshot);
    //   console.log("TTTTTTTTTTTTTTTTTTTT")
    //   console.log(sprintSnapshotSaved)
    //   if (sprintSnapshotSaved) {
    //     sprintSnapshotMetricSaved = await this.sprintMetricRepository.save(sprintSnapshotMetric);
    //     console.log("SSSSSSSSSSSSSSSSSSS")
    //     console.log(sprintSnapshotMetricSaved)
    //   }
    // }
    // if (sprintSnapshotMetricSaved) {
    //   return true;
    // }
    // console.log(sprint);
    // console.log(sprintSnapshot);
    // console.log(sprintSnapshotMetric);
    // return 'will return boolean';
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
}
// console.log(sprint)

// sprint.sprintNumber=
// sprint.id = 0;
// sprint.sprintNumber = 0;
// sprint.startDate = '';
// sprint.endDate = '';
// sprint.state = '';
// sprint.team = {} as Team;
// sprint.workUnit = ''
//   let sprintKeys = Object.keys(sprint);
//   for (let object of processedJson.properties) {
// let x = object.key;
// let splittedKeys = x.split("_");
// var actualKey = splittedKeys[splittedKeys.length - 1];
//     console.log(actualKey);
//     if (sprintKeys.includes(actualKey)) {

//       (sprint as any)[actualKey] = object.value;

//       let index = sprintKeys.indexOf(actualKey);
//       sprintKeys.splice(index, 1);

//     }

//   }
//   console.log(sprint);
//   return sprint;
