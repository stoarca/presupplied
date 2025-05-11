import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

// Use type import to avoid circular dependency
import type { StudentProgress } from './StudentProgress';

interface StudentParams {
  name: string;
  email: string;
  hashed: string;
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar' })
  name: string;

  @Index({unique: true})
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  hashed: string;

  @OneToMany(
    'StudentProgress',
    'student'
  )
  progress!: StudentProgress[];

  constructor(params: StudentParams) {
    this.name = params.name;
    this.email = params.email;
    this.hashed = params.hashed;
  }
}