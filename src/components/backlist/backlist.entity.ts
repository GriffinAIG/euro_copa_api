import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
@Entity({ name: "backlist" })
export class Backlist {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public acToken: string;

  @Column({
    nullable: false,
  })
  public userId: number;

  @Column({
    default: 1,
  })
  public status: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "createdAt",
  })
  public createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public updatedAt!: Date;
}
