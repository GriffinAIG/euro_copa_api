import { BaseEntity } from "src/common/common.dto/base.entity";
import { User } from "src/components/user/user.entity";
import { Entity, Column, ManyToOne } from "typeorm";

@Entity({ name: "user_score" })
export class UserScore extends BaseEntity {
  @Column({ default: "" })
  source: string; // from mission 1 ||2||top bxh

  @Column({ default: "" })
  description: string;

  @Column({ default: 0 })
  goalsUsed: number;

  @Column({ default: 0 })
  score: number;

  @Column({ type: "int", default: 5, nullable: false })
  multiple: number;

  @Column({ type: "integer", nullable: false })
  status: number;

  @Column({ type: "varchar", length: 15, nullable: true })
  sendStatus: string;

  @Column({ type: "varchar", length: 63, nullable: true })
  transRef1: string;

  @Column({ type: "varchar", length: 63, nullable: true })
  ft: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  user: User;
}
