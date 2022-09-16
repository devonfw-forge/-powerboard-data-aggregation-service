import {  Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Team } from './team.entity';
import { BaseEntity } from '../../../shared/model/entities/base-entity.entity';
@Entity()
export class TeamSpiritMedian extends BaseEntity {
  @Column('int', { name: 'survey_median', nullable: true })
  surveyMedian!: number;

  @Column('timestamp', { name: 'start_date', nullable: true })
  startDate!: string;

  @Column('timestamp', { name: 'end_date', nullable: true })
  endDate!: string;

  @Column('varchar', { name: 'survey_code', nullable: true })
  surveyCode!: string;

  @ManyToOne(() => Team, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team!: Team;
}
