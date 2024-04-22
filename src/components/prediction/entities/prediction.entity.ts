import { BaseEntity } from 'src/common/common.dto/base.entity';
import { Match } from 'src/components/match/entities/match.entity';
import { User } from 'src/components/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity({ name: "prediction" })
export class Prediction extends BaseEntity {

    @ManyToOne(() => Match, (match) => match.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    match: Match;

    @Column({ nullable: false })
    mission: number;

    @Column({ nullable: false, default: 0 })
    status: string; // 0: chưa có kq, 1: đã có kq

    @Column({ nullable: false, default: "" })
    predicted: string;

    @Column({ nullable: true, default: "" })
    matchResult: string; //nv1: 'doivodich-doiaquan-tysochungket' ex:  ''
    //nv2: 'teamId-teamName-win' || 'draw'( chỉ có ở vòng bảng )

    @Column({ nullable: true, default: "" })
    result: string; // -1: sai , 1: đúng

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    user: User

}

