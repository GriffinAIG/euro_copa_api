import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePredictionDto {
    @ApiProperty()
    @IsNotEmpty()
    mission: number; //1||2 

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    predicted: string; //nv1: 'doivodich-doiaquan-tysochungket' ex:  ''
    //nv2: 'teamId-teamName-win' || 'draw'( chỉ có ở vòng bảng )

    @ApiProperty()
    @IsNotEmpty()
    matchId: number;
}
