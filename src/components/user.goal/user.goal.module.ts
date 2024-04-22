import { Module } from "@nestjs/common";
import { UserGoalService } from "./user.goal.service";
import { UserGoalController } from "./user.goal.controller";
import { UserGoal } from "./entities/user.goal.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([UserGoal])],
  controllers: [UserGoalController],
  providers: [UserGoalService],
})
export class UserGoalModule {}
