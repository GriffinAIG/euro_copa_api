import { BaseEntity } from "src/common/common.dto/base.entity";
import { Prediction } from "src/components/prediction/entities/prediction.entity";
import { Team } from "src/components/team/entities/team.entity";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "match" })
export class Match extends BaseEntity {
  @ManyToOne(() => Team, (team: any) => team.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  teamA: Team;

  @ManyToOne(() => Team, (team: any) => team.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  teamB: Team;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  matchRound: string;

  @Column({ nullable: false, default: '' })
  matchName: string

  @Column({ nullable: false, default: '' })
  tournament: string

  // Các dự đoán cho trận đấu
  @OneToMany(() => Prediction, (prediction) => prediction.id, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  predictions: Prediction[];

  // tỷ số trận đấu
  @Column({ nullable: true, default: "" })
  aggregate: string;

  // Kết quả của trận đấu
  @Column({ nullable: true, default: "" })
  result: string; //nv1: 'doivodich-doiaquan-tysochungket' ex:  ''
  //nv2: 'teamId-teamName-win' || 'draw'( chỉ có ở vòng bảng )

  @Column({ nullable: false, default: "-1" })
  status: string; // -1: chưa diễn ra , 0 đang diễn ra, 1: đã kết thúc
}
