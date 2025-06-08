import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import type { User } from './User';
import { ProgressVideoStatus } from '../../../common/types';

interface UserVideoProgressParams {
  user: User;
  videoId: string;
  status: ProgressVideoStatus;
}

@Entity()
@Index(['user', 'videoId'], {unique: true})
export class UserVideoProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar' })
  videoId: string;

  @Column({
    type: 'enum',
    enum: ProgressVideoStatus,
    default: ProgressVideoStatus.NOT_WATCHED,
  })
  status: ProgressVideoStatus;

  constructor(params: UserVideoProgressParams) {
    this.user = params.user;
    this.videoId = params.videoId;
    this.status = params.status;
  }
}