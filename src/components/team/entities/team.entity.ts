import { BaseEntity } from 'src/common/common.dto/base.entity';
import { Match } from 'src/components/match/entities/match.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: "team" })
export class Team extends BaseEntity {

    @Column({ nullable: false })
    name: string;


    @Column({ nullable: false })
    flagUrl: string;

    // Các trận đấu mà đội tham gia
    @OneToMany(
        () => Match, (match: any) => match.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    }
    )
    matches: Match[];

    @Column({ type: "text", nullable: true })
    rewardTitle: string;

    @Column({ nullable: true, default: false })
    eliminated: boolean;

}
