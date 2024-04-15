import { Module } from "@nestjs/common";
import { APIModule } from "./api.third/api.third.module";
import { AuthModule } from "./auth/auth.module";
import { BacklistModule } from "./backlist/backlist.module";
import { PermissionModule } from "./permission/permission.module";
import { UserModule } from "./user/user.module";
import { UserInfoModule } from "./user.info/user.info.module";
import { SysConfigsModule } from "./sys.config/sys.config.module";
import { TeamModule } from './team/team.module';
import { MatchModule } from './match/match.module';
import { PredictionModule } from './prediction/prediction.module';
import { UserScoreModule } from './user.score/user.score.module';
import { UserHistoryModule } from "./user.history/user.history.module";
import { EventTimeModule } from "./event.time.third/event.time.third.module";
import { UserGoalModule } from './user.goal/user.goal.module';

@Module({
  imports: [
    AuthModule,
    PermissionModule,
    EventTimeModule,
    UserModule,
    BacklistModule,
    APIModule,
    UserHistoryModule,
    UserInfoModule,
    SysConfigsModule,
    TeamModule,
    MatchModule,
    PredictionModule,
    UserScoreModule,
    UserGoalModule,
  ],
})
export class MainModule { }
