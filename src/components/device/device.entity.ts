import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "devices" })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  mac: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  ip: string;

  @Column({ type: "boolean", default: false })
  isDeleted: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
