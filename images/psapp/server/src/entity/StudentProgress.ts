import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

import { Student } from './Student';
import { Module } from './Module';
import { ProgressStatus } from '../../../common/types';

interface StudentProgressParams {
  student: Student;
  module: Module;
  status: ProgressStatus;
}

@Entity()
@Index(['student', 'module'], {unique: true})
export class StudentProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Student, (student) => student.progress)
  student: Student;

  @ManyToOne(() => Module)
  module: Module;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.NOT_ATTEMPTED,
  })
  status: ProgressStatus;

  constructor(params: StudentProgressParams) {
    this.student = params.student;
    this.module = params.module;
    this.status = params.status;
  }
}

