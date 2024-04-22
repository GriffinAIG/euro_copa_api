import { BaseEntity } from "src/common/common.dto/base.entity";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "sys_configs" })
@Index("module_index", ["module"], { unique: false })
export class SysConfig extends BaseEntity {
  @Column({
    type: "varchar",
    length: 225,
    nullable: false,
  })
  module: string;

  @Column({
    type: "varchar",
    length: 225,
    nullable: true,
  })
  key: string;

  @Column({
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  value: string;

  @Column({ nullable: true, default: false })
  isNotDelete: boolean;
}
