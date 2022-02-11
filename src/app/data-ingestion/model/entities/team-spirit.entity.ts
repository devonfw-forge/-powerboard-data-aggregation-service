import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/model/entities/base-entity.entity';
import { Sprint } from './sprint.entity';

@Entity()
export class TeamSpirit extends BaseEntity {
  @Column('int', { nullable: false })
  team_spirit_rating!: number;

  @OneToOne(() => Sprint, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sprint_id', referencedColumnName: 'id' })
  sprint!: Sprint;
}
