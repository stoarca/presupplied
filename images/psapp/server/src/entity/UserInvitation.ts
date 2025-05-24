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

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

interface UserInvitationParams {
  inviterUser: User;
  childUser: User;
  inviteeEmail: string;
  relationshipType: RelationshipType;
}

@Entity()
@Index(['inviteeEmail', 'childId'], { unique: true })
export class UserInvitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "inviter_id" })
  inviterUser: User;

  @Column({ type: 'int' })
  inviterId: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "child_id" })
  childUser: User;

  @Column({ type: 'int' })
  childId: number;

  @Index()
  @Column({ type: 'varchar' })
  inviteeEmail: string;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    default: RelationshipType.OBSERVER,
  })
  relationshipType: RelationshipType;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: "invitee_user_id" })
  inviteeUser?: User;

  @Column({ type: 'int', nullable: true })
  inviteeUserId?: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'varchar', unique: true })
  token: string;

  constructor(params: UserInvitationParams) {
    this.inviterUser = params.inviterUser;
    this.childUser = params.childUser;
    this.inviterId = params.inviterUser.id;
    this.childId = params.childUser.id;
    this.inviteeEmail = params.inviteeEmail;
    this.relationshipType = params.relationshipType;
    this.status = InvitationStatus.PENDING;
    this.token = '';
  }
}