import { Module } from "@nestjs/common";
import { UserScoreService } from "./user.score.service";
import { UserScoreController } from "./user.score.controller";
import { UserScore } from "./entities/user.score.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserScore])],
  controllers: [UserScoreController],
  providers: [UserScoreService],
})
export class UserScoreModule {}
