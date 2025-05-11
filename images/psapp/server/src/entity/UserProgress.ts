import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

// Import type only to avoid circular dependency
import type { User } from './User';
import { Module } from './Module';
import { UserProgressVideo } from './UserProgressVideo';
import { ProgressStatus } from '../../../common/types';

interface UserProgressParams {
  user: User;
  module: Module;
  status: ProgressStatus;
}

@Entity()
@Index(['user', 'module'], {unique: true})
export class UserProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('User', 'progress', { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Module)
  module: Module;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_ATTEMPTED,
  })
  status: ProgressStatus;

  @OneToMany(
    () => UserProgressVideo,
    (userProgressVideo) => userProgressVideo.userProgress
  )
  videos!: UserProgressVideo[];

  constructor(params: UserProgressParams) {
    this.user = params.user;
    this.module = params.module;
    this.status = params.status;
  }
}