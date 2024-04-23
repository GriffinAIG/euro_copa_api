import { Module } from "@nestjs/common";
import { MatchService } from "./match.service";
import { MatchController } from "./match.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { Team } from "../team/entities/team.entity";
import { TeamModule } from "../team/team.module";
import { CrawlerDataService } from "../crawler-data/crawler-data.service";

@Module({
  imports: [TypeOrmModule.forFeature([Match, Team]), TeamModule],
  controllers: [MatchController],
  providers: [MatchService, CrawlerDataService],
  exports: [MatchService],
})
export class MatchModule { }
