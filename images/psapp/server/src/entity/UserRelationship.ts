import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm"

import { User } from './User';
import { RelationshipType } from '../../../common/types';

@Entity()
export class UserRelationship {
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @PrimaryColumn({ type: 'int' })
  adultId!: number;

  @PrimaryColumn({ type: 'int' })
  childId!: number;

  @ManyToOne(() => User, user => user.childRelationships, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "adult_id" })
  adult!: User;

  @ManyToOne(() => User, user => user.parentRelationships, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "child_id" })
  child!: User;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    default: RelationshipType.OBSERVER,
  })
  type!: RelationshipType;
}
