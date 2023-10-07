import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

interface ModuleParams {
  vanityId: string;
}

@Entity()
export class Module {
  @PrimaryGeneratedColumn()
  id!: number

  @Index({unique: true})
  @Column()
  vanityId: string

  constructor(params: ModuleParams) {
    this.vanityId = params.vanityId;
  }
}
