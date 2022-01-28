import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/model/entities/base-entity.entity';
import { Team } from './team.entity';

@Entity()
export class ProjectCodesEntity extends BaseEntity {
  @OneToOne(() => Team, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id', referencedColumnName: 'id' })
  team!: Team;

  @Column('varchar', { nullable: true })
  sonarqubeId!: string;

  @Column('varchar', { nullable: true })
  jiraId!: string;
}
