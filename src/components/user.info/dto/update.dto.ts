import { PartialType } from "@nestjs/swagger";
import { CreateUserInfoDto } from "./create.dto";

export class UpdateUserInfoDto extends PartialType(CreateUserInfoDto) {}
