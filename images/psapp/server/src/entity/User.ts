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
import type { UserProgress } from './UserProgress';
import type { UserRelationship } from './UserRelationship';

import { UserType } from '../../../common/types';
import type { ProfilePicture } from '../../../common/types';

interface UserParams {
  name: string;
  email?: string;
  hashed?: string;
  type: UserType;
  profilePicture?: ProfilePicture;
  pin?: string;
  pinRequired?: boolean;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar' })
  name: string;

  @Index({ unique: true, where: "email IS NOT NULL" })
  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  hashed?: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.STUDENT,
  })
  type: UserType;

  @Column({ type: 'json', nullable: true })
  profilePicture?: ProfilePicture;
  
  @Column({ type: 'varchar', nullable: true })
  pin?: string;
  
  @Column({ type: 'boolean', default: false })
  pinRequired: boolean;

  @OneToMany(
    'UserProgress',
    'user',
    { cascade: true }
  )
  progress!: UserProgress[];

  
  @OneToMany(
    'UserRelationship',
    'adult',
    { cascade: true }
  )
  childRelationships!: UserRelationship[];

  @OneToMany(
    'UserRelationship',
    'child',
    { cascade: true }
  )
  parentRelationships!: UserRelationship[];

  // Virtual property to get children through relationships
  get children(): User[] {
    if (!this.childRelationships) {
      return [];
    }
    return this.childRelationships.map(rel => rel.child).filter(child => child);
  }

  // Virtual property to get parents through relationships  
  get parents(): User[] {
    if (!this.parentRelationships) {
      return [];
    }
    return this.parentRelationships.map(rel => rel.adult).filter(adult => adult);
  }

  constructor(params: UserParams) {
    this.name = params.name;
    this.email = params.email;
    this.hashed = params.hashed;
    this.type = params.type || UserType.STUDENT;
    this.profilePicture = params.profilePicture;
    this.pin = params.pin;
    this.pinRequired = params.pinRequired || false;
  }
}
