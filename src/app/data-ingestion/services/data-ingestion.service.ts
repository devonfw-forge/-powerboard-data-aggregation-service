import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * It takes the keys of key-value pairs of prcessedJson and matches them with the fields of Team
   * Spirit entity and then create the team spirit entity object consisting of current active sprint
   * and persisit it in the db
   */
  async ingestTeamSpirit(processedJson: Group[], teamId: string) {
    console.log('inside ingestion service');
    for (let group of processedJson) {
      let teamSpirit: TeamSpirit = {} as TeamSpirit;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.team_spirit_rating) {
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

      console.log('Team Spirittttttttttttttttttttttt');
      console.log(teamSpirit);
      const savedEntity = await this.persistTeamSpiritEntity(teamSpirit);

      return savedEntity;
    }
  }

  async persistTeamSpiritEntity(teamSpirit: TeamSpirit) {
    const currentTeamSpirit = (await this.teamSpiritRepository.findOne({
      where: { sprint: teamSpirit.sprint },
    })) as TeamSpirit;

    if (currentTeamSpirit) {
      currentTeamSpirit.team_spirit_rating = teamSpirit.team_spirit_rating;
      return this.teamSpiritRepository.save(currentTeamSpirit);
    }

    return this.teamSpiritRepository.save(teamSpirit);
  }

  /**
   * It takes the keys of key-value pairs of prcessedJson and matches them with the fields of Client
   * status entity and then create the client status entity object consisting of current active sprint
   * and persisit it in the db
   */
  async ingestClientStatus(processedJson: Group[], teamId: string) {
    for (let group of processedJson) {
      let clientStatus: ClientStatus = {} as ClientStatus;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.client_rating) {
          clientStatus.client_rating = Number(object.value);
        }
      }
      const activeSprint: any = (await this.sprintRepository
        .createQueryBuilder('sprint')
        .addSelect('sprint.id')
        .addSelect('st.status')
        .innerJoin(SprintStatus, 'st', 'st.id=sprint.status')
        .where('sprint.team_id =:team_Id', { team_Id: teamId })
        .andWhere('sprint.status=:status', { status: '11155bf2-ada5-495c-8019-8d7ab76d488e' })
        .orderBy('sprint.sprint_number', 'DESC')
        .getRawOne()) as Sprint;

      clientStatus.sprint = activeSprint;
      const savedEntity = await this.persistClientStatusEntity(clientStatus);
      if (savedEntity) {
        let team = await this.teamRepository.findOne(teamId);
        if (team) {
          this.updateTeamStatus(team);
        } else {
          throw new NotFoundException('Team not found Exception');
        }
      }
      return savedEntity;
    }
  }
  async persistClientStatusEntity(clientStatus: ClientStatus) {
    const currentClientStatus: any = (await this.clientStatusRepository.findOne({
      where: { sprint: clientStatus.sprint },
    })) as ClientStatus;
    if (currentClientStatus) {
      currentClientStatus.client_rating = clientStatus.client_rating;
      return this.clientStatusRepository.save(currentClientStatus);
    }
    return this.clientStatusRepository.save(clientStatus);
  }

  /**
   * It matches the keys of key-value pairs of processedJson with the required entity fields and creates
   * all the required entity objects and finally persist them all together into the db with
   * the help of persistEntities method
   */
  /* async ingestJira(processedJson: Group[], teamId: string): Promise<any> {
    let sprintArray: Sprint[] = [];
    for (let group of processedJson) {
      let sprint: Sprint = {} as Sprint;
      let sprintSnapshotMetricValue: string = '';
      let sprintMetric: SprintMetric = {} as SprintMetric;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.sprint_number) {
          sprint.sprint_number = Number(object.value);
        }
        if (actualKey === defaults.start_date) {
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
        if (actualKey === defaults.end_date) {
          sprint.end_date = object.value;
        }
        if (actualKey === defaults.work_unit) {
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
 */

  /**
   * It takes the keys of key-value pairs from processsedJson and matches them with the code quality
   * entity fields and create a code quality entity object. And then persist it in the db
   */
  async ingestCodeQuality(processedJson: Group[], teamId: string) {
    let codeQualityArray: CodeQualitySnapshot[] = [] as CodeQualitySnapshot[];
    for (let group of processedJson) {
      let codeQuality: CodeQualitySnapshot = {} as CodeQualitySnapshot;
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.bugs) {
          codeQuality.bugs = Math.round(Number(object.value));
        }
        if (actualKey === defaults.code_smell) {
          codeQuality.codeSmells = Math.round(Number(object.value));
        }
        if (actualKey === defaults.code_coverage) {
          codeQuality.code_coverage = Math.round(Number(object.value));
        }
        if (actualKey === defaults.status) {
          codeQuality.status = object.value;
        }
        if (actualKey === defaults.snapshot_time) {
          codeQuality.snapshot_time = object.value;
        }
      }
      let team = await this.teamRepository.findOne(teamId);
      if (team) {
        codeQuality.team = team;
      } else {
        throw new NotFoundException('Team not found Exception');
      }

      const codeQualitySnapshotSaved = await this.persistCodeQuality(codeQuality);
      if (codeQualitySnapshotSaved) {
        codeQualityArray.push(codeQualitySnapshotSaved);
        this.updateTeamStatus(team);
      } else {
        throw new ConflictException('Error uploading sonar !! Please try again');
      }
    }

    return codeQualityArray;
  }

  async persistCodeQuality(codeQualityEntity: CodeQualitySnapshot) {
    return this.codeQualitySnapshotRepository.save(codeQualityEntity);
  }

  async updateTeamStatus(teamEntity: Team) {
    teamEntity.isStatusChanged = true;
    return this.teamRepository.save(teamEntity);
  }

  async findTeamUsingTeamId(teamId: string): Promise<string | Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (team) {
      return team;
    } else {
      return 'team not found';
    }
  }

  /**
   * It matches the keys of key-value pairs of processedJson with the required entity fields and creates
   * all the required entity objects and finally persist them all together into the db with
   * the help of persistEntities method
   */
  async ingestJira(processedJson: Group[], teamId: string): Promise<any> {
    let sprintArray: Sprint[] = [];
    for (let group of processedJson) {
      let sprint: Sprint = {} as Sprint;
      let sprintSnapshotMetricCompletedValue: string = '';
      let sprintSnapshotMetricCommittedValue: string = '';
      let sprintSnapshotTime: string = '';
      for (let object of group.properties) {
        let key = object.key;
        let splittedKeys = key.split('_');
        var actualKey = splittedKeys[splittedKeys.length - 1];
        if (actualKey === defaults.sprint_number) {
          sprint.sprint_number = Number(object.value);
        }
        if (actualKey === defaults.start_date) {
          sprint.start_date = object.value;
        }
        if (actualKey === defaults.state) {
          if (object.value === 'active') {
            object.value = 'In Progress';
          } else {
            object.value = 'Completed';
          }
          const sprintStatus = await this.sprintStatusRepository.findOne({ where: { status: object.value } });
          if (sprintStatus) {
            sprint.status = sprintStatus!.id;
          } else {
            throw new NotFoundException("State doesn't match");
          }
        }
        if (actualKey === defaults.end_date) {
          sprint.end_date = object.value;
        }
        if (actualKey === defaults.work_unit) {
          const sprintWorkUnit = await this.sprintWorkUnitRepository.findOne({ where: { work_unit: object.value } });
          if (sprintWorkUnit) {
            sprint.work_unit = sprintWorkUnit!.id;
          } else {
            throw new NotFoundException("Work Unit doesn't match");
          }
        }

        if (actualKey === defaults.completed) {
          sprintSnapshotMetricCompletedValue = object.value;
        }

        if (actualKey === defaults.committed) {
          sprintSnapshotMetricCommittedValue = object.value;
        }

        if (actualKey === defaults.jira_snapshot_time) {
          sprintSnapshotTime = object.value;
        }
      }
      const team = (await this.teamRepository.findOne({ where: { id: teamId } })) as Team;

      if (team) {
        sprint.team = team!;
        sprintArray.push(sprint);
      } else {
        throw new NotFoundException('Team not found Exception');
      }

      const result = await this.persistJiraEntities(
        sprint,
        sprintSnapshotTime,
        sprintSnapshotMetricCommittedValue,
        sprintSnapshotMetricCompletedValue,
      );

      if (result) {
        this.updateTeamStatus(team);
      }
      console.log(result);
    }

    return sprintArray;
  }

  /**
   * It persists the sprint, sprintSnapshot and SprintSnapshotMetric entity into the db and returns
   * success message if everything goes smooth or failure message if there is any error
   */
  async persistJiraEntities(
    sprint: Sprint,
    sprintSnapshotTime: string,
    sprintSnapshotMetricCommittedValue: string,
    sprintSnapshotMetricCompletedValue: string,
  ) {
    let result: boolean = true;
    let sprintSnapshot: SprintSnapshot = new SprintSnapshot();
    const existedSprint = (await this.sprintRepository.findOne({
      where: { sprint_number: sprint.sprint_number, team: sprint.team },
    })) as Sprint;
    if (existedSprint) {
      console.log(existedSprint.work_unit);
      console.log(sprint.work_unit);
      const workUnit = existedSprint.work_unit as unknown as SprintWorkUnit;
      if (workUnit.id !== sprint.work_unit) {
        throw new NotFoundException("Work Unit doesn't match");
      }
      let newDate = new Date(sprintSnapshotTime);
      const sprintSnapshots = (await this.sprintSnapshotRepository.find({
        where: { sprint: existedSprint, date_time: newDate },
      })) as SprintSnapshot[];
      if (sprintSnapshots.length > 0) {
        throw new ConflictException('Sprint Snapshot already exist');
      }
      existedSprint.status = sprint.status;
      existedSprint.start_date = sprint.start_date;
      existedSprint.end_date = sprint.end_date;

      const updatedSprint = await this.sprintRepository.save(existedSprint);
      if (updatedSprint) {
        sprintSnapshot = this.createSprintSnapshotEntity(updatedSprint, sprintSnapshotTime);
      }
    } else {
      const sprintCreated = await this.sprintRepository.save(sprint);
      if (sprintCreated) {
        sprintSnapshot = this.createSprintSnapshotEntity(sprintCreated, sprintSnapshotTime);
      }
    }
    const sprintSnapshotSaved = await this.sprintSnapshotRepository.save(sprintSnapshot);
    if (sprintSnapshotSaved) {
      if (sprintSnapshotMetricCommittedValue !== '') {
        const sprintMetricCommitted = (await this.sprintMetricRepository.findOne({
          where: { name: 'Work Committed' },
        })) as SprintMetric;
        if (sprintMetricCommitted) {
          const sprintSnapshotMetric = await this.createSprintSnapshotMetricEntity(
            sprintSnapshotMetricCommittedValue,
            sprintSnapshotSaved,
            sprintMetricCommitted,
          );
          const sprintSnapshotMetricSaved = await this.sprintSnapshotMetricRepository.save(sprintSnapshotMetric);
          if (sprintSnapshotMetricSaved) {
            console.log(sprintSnapshotMetricSaved);
            result = true;
          } else {
            result = false;
          }
        }
      }
      if (sprintSnapshotMetricCompletedValue !== '') {
        const sprintMetricCompleted = (await this.sprintMetricRepository.findOne({
          where: { name: 'Work Completed' },
        })) as SprintMetric;
        if (sprintMetricCompleted) {
          const sprintSnapshotMetric = await this.createSprintSnapshotMetricEntity(
            sprintSnapshotMetricCompletedValue,
            sprintSnapshotSaved,
            sprintMetricCompleted,
          );
          const sprintSnapshotMetricSaved = await this.sprintSnapshotMetricRepository.save(sprintSnapshotMetric);
          if (sprintSnapshotMetricSaved) {
            console.log(sprintSnapshotMetricSaved);
            result = true;
          } else {
            result = false;
          }
        }
      }
    }
    return result;
  }

  /**
   * It creates sprint Snapshot entity object and returns it
   */
  createSprintSnapshotEntity(sprint: Sprint, snapshotTime: string): SprintSnapshot {
    let sprintSnapshot: SprintSnapshot = {} as SprintSnapshot;
    sprintSnapshot.sprint = sprint;
    sprintSnapshot.date_time = snapshotTime;
    return sprintSnapshot;
  }

  /**
   * It creates a sprintSnapshotMetric entity object out of the inputs given to it and then returns
   * the same
   */
  createSprintSnapshotMetricEntity(value: string, sprintSnapshot: SprintSnapshot, sprintMetric: SprintMetric) {
    let sprintSnapshotMetric: SprintSnapshotMetric = {} as SprintSnapshotMetric;
    sprintSnapshotMetric.value = value;
    sprintSnapshotMetric.snapshot = sprintSnapshot;
    sprintSnapshotMetric.metric = sprintMetric;
    return sprintSnapshotMetric;
  }
}
