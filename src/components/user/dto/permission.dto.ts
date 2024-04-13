import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
export class PermissionUserDto {
  @ApiProperty()
  @IsArray()
  permission: string[];
}

export default PermissionUserDto;
