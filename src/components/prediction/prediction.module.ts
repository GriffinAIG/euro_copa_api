import { Module } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { PredictionController } from "./prediction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prediction } from "./entities/prediction.entity";
import { Match } from "../match/entities/match.entity";
import { MatchModule } from "../match/match.module";
import { TeamModule } from "../team/team.module";
import { Team } from "../team/entities/team.entity";
import { User } from "../user/user.entity";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Prediction, Match, Team, User]), MatchModule, TeamModule, UserModule],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule { }
