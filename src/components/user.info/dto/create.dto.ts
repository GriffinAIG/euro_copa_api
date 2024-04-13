import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "gameType",
    default: 0,
    type: Number,
  })
  gameType: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "userId",
    default: 0,
    type: Number,
  })
  userId: number;
}
