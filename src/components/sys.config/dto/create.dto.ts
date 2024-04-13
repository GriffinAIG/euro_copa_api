import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateSysConfigsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: "parentId of the config",
    example: 0,
    type: Number,
  })
  parentId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "module name of the config",
    example: "module 0",
    maxLength: 255,
    type: String,
  })
  module: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "item name of the config",
    example: "item 0",
    maxLength: 255,
    type: String,
  })
  item: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "item name of the config",
    example: "item 0",
    maxLength: 255,
    type: String,
  })
  itemCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value of the config",
    example: "value 0",
    maxLength: 1023,
    type: String,
  })
  value: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value1 of the config",
    example: "value 0",
    maxLength: 511,
    type: String,
  })
  value1: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "value2 of the config",
    example: "value 0",
    maxLength: 511,
    type: String,
  })
  value2: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: "isNotDelete of the config",
    example: false,
    default: false,
    type: Boolean,
  })
  isNotDelete: boolean;
}
