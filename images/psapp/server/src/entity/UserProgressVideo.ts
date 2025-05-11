import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

// Import for type only
import type { UserProgress } from './UserProgress';
import { ProgressVideoStatus } from '../../../common/types';

interface UserProgressVideoParams {
  userProgress: UserProgress;
  videoVanityId: string;
  status: ProgressVideoStatus;
}

@Entity()
@Index(['userProgress', 'videoVanityId'], {unique: true})
export class UserProgressVideo {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Use string literal to avoid circular dependency in runtime
  @ManyToOne('UserProgress', 'videos')
  userProgress: UserProgress;

  @Column({ type: 'varchar' })
  videoVanityId: string;

  @Column({
    type: 'enum',
    enum: ProgressVideoStatus,
    default: ProgressVideoStatus.NOT_WATCHED,
  })
  status: ProgressVideoStatus;

  constructor(params: UserProgressVideoParams) {
    this.userProgress = params.userProgress;
    this.videoVanityId = params.videoVanityId;
    this.status = params.status;
  }
}