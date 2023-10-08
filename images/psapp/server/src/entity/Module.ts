import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

interface ModuleParams {
  vanityId: string;
}

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Index({unique: true})
  @Column()
  vanityId: string;

  constructor(params: ModuleParams) {
    this.vanityId = params.vanityId;
  }
}
