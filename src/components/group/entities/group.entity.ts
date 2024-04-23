import { BaseEntity } from "src/common/common.dto/base.entity";
import { Match } from "src/components/match/entities/match.entity";
import { Team } from "src/components/team/entities/team.entity";
import { Entity, Column, OneToMany } from "typeorm";

@Entity({ name: "group" })
export class Group extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @OneToMany(() => Team, (team: any) => team.id, {
        cascade: true,
        createForeignKeyConstraints: false,
    })
    teams: Team[];
}
