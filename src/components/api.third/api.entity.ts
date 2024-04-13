import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "apis" })
@Index("api_UNIQUE", ["api"], { unique: true })
export class API {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  api: string;

  @Column({
    nullable: false,
  })
  action: string;

  @Column({
    nullable: false,
  })
  department: string;

  @Column({ type: "boolean", default: true })
  isActive: number;

  @Column({ type: "boolean", default: false })
  isDeleted: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
