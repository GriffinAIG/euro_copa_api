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

    @Column()
    mission: number;

    @Column()
    predicted: string;

    @Column()
    status: string; // 0: chưa có kq, 1: đã có kq

    @Column()
    predictedResult: string; //nv1: 'doivodich-doiaquan-tysochungket' ex: 
    //nv2: 'win-teamA' || 'draw'( chỉ có ở vòng bảng )

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    user: User

}

