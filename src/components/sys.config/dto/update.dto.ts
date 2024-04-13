import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSysConfigsDto {
  // @IsNumber()
  // @IsOptional()
  // @ApiProperty({
  //   description: "parentId of the config",
  //   example: 0,
  //   type: Number,
  // })
  // parentId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: "id of the config",
    example: 0,
    maxLength: 0,
    type: Number,
  })
  id: number;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   description: "module name of the config",
  //   example: "module - 0",
  //   maxLength: 255,
  //   type: String,
  // })
  // module: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   description: "item name of the config",
  //   example: "item - 0",
  //   maxLength: 255,
  //   type: String,
  // })
  // item: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   description: "item name of the config",
  //   example: "item 0",
  //   maxLength: 255,
  //   type: String,
  // })
  // itemCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value of the config",
    example: "value - 0",
    maxLength: 1023,
    type: String,
  })
  value: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value of the config",
    example: "value1 - 0",
    maxLength: 255,
    type: String,
  })
  value1: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value of the config",
    example: "value1 - 0",
    maxLength: 255,
    type: String,
  })
  value2: string;

  // @IsString()
  // @IsOptional()
  // @ApiProperty({
  //   description: "description of the config",
  //   example: "description - 0",
  //   maxLength: 255,
  //   type: String,
  // })
  // description: string;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked: boolean;

  // @IsBoolean()
  // @IsOptional()
  // @ApiProperty({
  //   description: "isNotDelete of the config",
  //   example: false,
  //   default: false,
  //   type: Boolean,
  // })
  // isNotDelete: boolean;
}
