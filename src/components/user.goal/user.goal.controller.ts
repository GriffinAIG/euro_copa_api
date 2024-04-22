import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserGoalService } from "./user.goal.service";
import { CreateUserGoalDto } from "./dto/create-user.goal.dto";
import { UpdateUserGoalDto } from "./dto/update-user.goal.dto";
import { RateLimitGuard } from "../auth/rate.guard/rate.limit.guard";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller("/api/v1/user-goal")
@ApiTags("UserGoal")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class UserGoalController {
  constructor(private readonly userGoalService: UserGoalService) {}

  @Post()
  create(@Body() createUserGoalDto: CreateUserGoalDto) {
    return this.userGoalService.create(createUserGoalDto);
  }

  @Get()
  findAll() {
    return this.userGoalService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userGoalService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserGoalDto: UpdateUserGoalDto
  ) {
    return this.userGoalService.update(+id, updateUserGoalDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userGoalService.remove(+id);
  }
}
