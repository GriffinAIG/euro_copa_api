import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({ name: "permissions" })
export class Permission {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: false })
  public role: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  public updatedAt!: Date;
}
