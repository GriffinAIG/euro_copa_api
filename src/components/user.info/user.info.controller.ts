import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginationQueryDto } from "../../common/common.dto";
import { Response } from "../../system/interfaces";
import { Roles } from "../auth/roles.guard/roles.decorator";
import { RolesGuard } from "../auth/roles.guard/roles.guard";
import { BacklistGuard } from "../backlist/backlist.guard";
import { UserRoles } from "../user/enums/user.enum";
import { JwtAuthGuard } from "./../auth/jwt/jwt-auth.guard";
import { UserInfo } from "./user.info.entity";
import { UserInfoService } from "./user.info.service";
import { CreateUserInfoDto, UpdateUserInfoDto } from "./dto/index";

@Controller("/api/v1/user-info")
@ApiTags("User-Info")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, BacklistGuard, RolesGuard)
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  @Post("create")
  @ApiOperation({
    description: "Create dto",
  })
  @ApiOkResponse({
    type: Response<UserInfo>,
  })
  async create(@Body() createDto: CreateUserInfoDto): Promise<any> {
    return this.userInfoService.create(createDto);
  }

  @Get("all")
  @ApiResponse({
    status: 2000,
    description: "Get list dto success",
  })
  @ApiQuery({
    name: "take",
    type: "number",
    description: "enter take (Take is limit in sql) of record",
    required: true,
  })
  @ApiQuery({
    name: "skip",
    type: "number",
    description: "enter skip (Skip is offset in sql) of record",
    required: true,
  })
  @ApiQuery({
    name: "order",
    type: "string",
    description:
      "The ORDER BY keyword sorts the records in ascending order by default. To sort the records in descending order, use the DESC|ASC keyword",
    required: true,
  })
  @ApiOperation({
    description: "Get all dto",
  })
  @ApiOkResponse({
    type: Response<UserInfo[]>,
  })
  @Roles(UserRoles.SUPPER)
  async GetAll(@Query() paginationQueryDto: PaginationQueryDto): Promise<any> {
    return this.userInfoService.getAll(paginationQueryDto);
  }

  @Get(":id")
  @ApiOperation({
    description: "Get dto by id",
  })
  @ApiOkResponse({
    type: Response<UserInfo>,
  })
  async GetOne(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.userInfoService.getOneById(id);
  }

  @Patch(":id")
  @ApiOperation({
    description: "Update dto",
  })
  @ApiOkResponse({
    type: Response<UserInfo>,
  })
  @UsePipes(ValidationPipe)
  @Roles(UserRoles.SUPPER)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserInfoDto
  ): Promise<any> {
    return this.userInfoService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({
    description: "Delete dto",
  })
  @Roles(UserRoles.SUPPER)
  async delete(@Param("id") id: number): Promise<any> {
    return this.userInfoService.delete(id);
  }
}
