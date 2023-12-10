import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import { StudentProgress } from './StudentProgress';
import { ProgressVideoStatus } from '../../../common/types';

interface StudentProgressVideoParams {
  studentProgress: StudentProgress;
  videoVanityId: string;
  status: ProgressVideoStatus;
}

@Entity()
@Index(['studentProgress', 'videoVanityId'], {unique: true})
export class StudentProgressVideo {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => StudentProgress, (studentProgress) => studentProgress.videos)
  studentProgress: StudentProgress;

  @Column()
  videoVanityId: string;

  @Column({
    type: 'enum',
    enum: ProgressVideoStatus,
    default: ProgressVideoStatus.NOT_WATCHED,
  })
  status: ProgressVideoStatus;

  constructor(params: StudentProgressVideoParams) {
    this.studentProgress = params.studentProgress;
    this.videoVanityId = params.videoVanityId;
    this.status = params.status;
  }
}
