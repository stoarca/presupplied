import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm"

import { User } from './User';
import { RelationshipType } from '../../../common/types';

interface UserRelationshipParams {
  adult: User;
  child: User;
  type: RelationshipType;
}

@Entity()
@Index(['adultId', 'childId'], { unique: true })
export class UserRelationship {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.childRelationships, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "adult_id" })
  adult: User;

  @Column({ type: 'int' })
  adultId: number;

  @ManyToOne(() => User, user => user.parentRelationships, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "child_id" })
  child: User;

  @Column({ type: 'int' })
  childId: number;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    default: RelationshipType.OBSERVER,
  })
  type: RelationshipType;

  constructor(params: UserRelationshipParams) {
    this.adult = params.adult;
    this.child = params.child;
    this.adultId = params.adult.id;
    this.childId = params.child.id;
    this.type = params.type;
  }
}