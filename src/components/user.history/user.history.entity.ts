import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { Device } from "./../device/device.entity";

@Entity({ name: "user_histories" })
export class UserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  count: number;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  action: string;

  @OneToOne(() => Device, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  device: Device;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  user: User;

  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
  })
  note: string;

  @Column({ type: "boolean", default: false })
  isDeleted: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
