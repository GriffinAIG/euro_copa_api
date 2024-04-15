import { BaseEntity } from 'src/common/common.dto/base.entity';

import { Prediction } from 'src/components/prediction/entities/prediction.entity';
import { User } from 'src/components/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity({ name: "user_goal" })
export class UserGoal extends BaseEntity {

    @ManyToOne(() => Prediction, (prediction) => prediction.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    prediction: Prediction;

    @Column({ default: '' })
    source: string; // from DTC or Prediction

    @Column({ default: '' })
    description: string;

    @Column({ default: '' })
    note: string;

    @Column({ default: 0 })
    goals: number;

    @ManyToOne(() => User, (user) => user.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    user: User
}


