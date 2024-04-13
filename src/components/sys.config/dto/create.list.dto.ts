import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { CreateSysConfigsDto } from "./create.dto";

export class CreateListSysConfigsDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  sysConfigs: CreateSysConfigsDto[];
}
