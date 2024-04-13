import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { BaseEntity } from "src/common/common.dto/base.entity";
import { UserScore } from "../user.score/entities/user.score.entity";

@Entity({ name: "user_info" })
export class UserInfo extends BaseEntity {

  @ManyToOne(() => User, (user: any) => user.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  user: User;

  @ManyToOne(() => UserScore, (userScore: any) => userScore.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  userScore: UserScore;

  @Column({ nullable: true })
  public gameType: number;

  @Column({ nullable: true })
  recharge: number;

  @Column({ nullable: true })
  betAmountNew: number;

  @Column({ nullable: true })
  betAmountOld: number;
}
