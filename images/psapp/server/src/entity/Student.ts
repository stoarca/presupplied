import {
  Entity, PrimaryGeneratedColumn, Column, Index, OneToMany
} from "typeorm"

import { StudentProgress } from './StudentProgress';

interface StudentParams {
  name: string;
  email: string;
  hashed: string;
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name: string

  @Index({unique: true})
  @Column()
  email: string

  @Column()
  hashed: string

  @OneToMany(
    () => StudentProgress,
    (studentProgress) => studentProgress.student
  )
  progress!: StudentProgress[];

  constructor(params: StudentParams) {
    this.name = params.name;
    this.email = params.email;
    this.hashed = params.hashed;
  }
}

