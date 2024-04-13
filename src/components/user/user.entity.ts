import * as bcrypt from "bcrypt";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BcryptSalt } from "../../system/constants/bcrypt.salt";
import { UserRoles } from "./enums/user.enum";
import { UserInfo } from "../user.info/user.info.entity";
import { UserScore } from "../user.score/entities/user.score.entity";
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  // @Column({ nullable: true })
  // public name: string;

  // @Column({ nullable: true })
  // public email: string;

  @Column({ unique: true, nullable: false })
  public username: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ nullable: true })
  public hashedRt: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.MEMBER })
  role: UserRoles;

  @Column({ type: "varchar", length: 511, nullable: true, default: "" })
  option: string;


  @Column({ type: "boolean", default: false })
  isDeleted: boolean;

  @Column({ type: "boolean", default: false })
  isBlocked: boolean;


  @OneToMany(() => UserInfo, (userInfo) => userInfo.user)
  userInfo: UserInfo[];

  @OneToMany(() => UserScore, (userScore) => userScore.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  user: User

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(BcryptSalt.SALT_ROUND);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
