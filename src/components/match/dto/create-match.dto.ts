import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMatchDto {
    @ApiProperty()
    @IsNotEmpty()
    teamAId: number;

    @ApiProperty()
    @IsNotEmpty()
    teamBId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    date: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    matchRound: string;
}
