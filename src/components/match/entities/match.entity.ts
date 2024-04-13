import { BaseEntity } from 'src/common/common.dto/base.entity';
import { Prediction } from 'src/components/prediction/entities/prediction.entity';
import { Team } from 'src/components/team/entities/team.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: "match" })
export class Match extends BaseEntity {

    @ManyToOne(() => Team, (team) => team.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    teamA: Team;

    @ManyToOne(() => Team, (team) => team.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    teamB: Team;

    @Column({ type: 'datetime' })
    date: Date;

    @Column()
    matchRound: string;

    // Các dự đoán cho trận đấu
    @OneToMany(() => Prediction, (prediction) => prediction.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    predictions: Prediction[];

    // Kết quả của trận đấu
    @Column({ nullable: true })
    result: string;

    @Column()
    status: string; // -1: chưa diễn ra , 0 đang diễn ra, 1: đã kết thúc

}
