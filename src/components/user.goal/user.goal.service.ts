import { Injectable } from "@nestjs/common";
import { CreateUserGoalDto } from "./dto/create-user.goal.dto";
import { UpdateUserGoalDto } from "./dto/update-user.goal.dto";

@Injectable()
export class UserGoalService {
  create(createUserGoalDto: CreateUserGoalDto) {
    return "This action adds a new userGoal";
  }

  findAll() {
    return `This action returns all userGoal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGoal`;
  }

  update(id: number, updateUserGoalDto: UpdateUserGoalDto) {
    return `This action updates a #${id} userGoal`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGoal`;
  }
}
