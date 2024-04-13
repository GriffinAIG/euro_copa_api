import { BaseEntity } from 'src/common/common.dto/base.entity';
import { Match } from 'src/components/match/entities/match.entity';
import { Prediction } from 'src/components/prediction/entities/prediction.entity';
import { User } from 'src/components/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: "user_score" })
export class UserScore extends BaseEntity {

    @ManyToOne(() => Prediction, (prediction) => prediction.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    prediction: Prediction;

    @Column({ default: '' })
    source: string;

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    note: string;

    @Column({ default: 0 })
    goals: number;

    @Column({ default: 0 })
    score: number;

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    user: User
}

