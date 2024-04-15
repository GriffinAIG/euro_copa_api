import { PartialType } from '@nestjs/mapped-types';
import { CreateUserGoalDto } from './create-user.goal.dto';

export class UpdateUserGoalDto extends PartialType(CreateUserGoalDto) {}
