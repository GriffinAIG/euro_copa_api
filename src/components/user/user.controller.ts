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
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "../../system/interfaces";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { Roles } from "../auth/roles.guard/roles.decorator";
import { RolesGuard } from "../auth/roles.guard/roles.guard";
import { BacklistGuard } from "../backlist/backlist.guard";
import { UserService } from "../user/user.service";
import { PaginationQueryDto } from "./../../common/common.dto/pagination.query.dto";
import UserUpdateDto from "./dto/beginner.dto";
import {
  BlockUserDto,
  CreateUserDto,
  UpdateRoleDto,
  UpdateUserDto,
} from "./dto/index";
import { UserRoles } from "./enums/user.enum";
import { User } from "./user.entity";
import { RateLimitGuard } from "../auth/rate.guard/rate.limit.guard";
import PermissionUserDto from "./dto/permission.dto";
@Controller("/api/v1/user")
@ApiTags("User")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get("user-info")
  @ApiOperation({
    description: "User Get user information",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UseGuards(JwtAuthGuard)
  async userGetInfo(@Request() req: any): Promise<any> {
    return this.userService.userGetInfo(req.user.id);
  }

  @Patch("user-info")
  @ApiOperation({
    description: "User update user information",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UseGuards(JwtAuthGuard)
  async userUpdateInfo(
    @Body() userBeginner: UserUpdateDto,
    @Request() req: any
  ): Promise<any> {
    const { isBeginner } = userBeginner;
    return this.userService.update(req.user?.id, null, { isBeginner });
  }

  @Post("create")
  @ApiOperation({
    description: "Create user",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async create(@Body() userDto: CreateUserDto): Promise<any> {
    return this.userService.create(userDto);
  }

  @Get("all")
  @ApiOperation({
    description: "Get all user",
  })
  @ApiOkResponse({
    type: Response<User[]>,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_VIEW)
  async GetAll(@Query() paginationQuery: PaginationQueryDto): Promise<any> {
    return this.userService.getAll(paginationQuery);
  }

  @Get(":id")
  @ApiOperation({
    description: "Get user by id",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_VIEW)
  async GetOne(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.userService.getOneById(id);
  }

  @Patch(":id")
  @ApiOperation({
    description: "Update user",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() userDto: UpdateUserDto
  ): Promise<any> {
    return this.userService.update(id, userDto);
  }

  @Patch(":id/role")
  @ApiOperation({
    description: "Update user",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async updateRole(
    @Param("id", ParseIntPipe) id: number,
    @Body() roleDto: UpdateRoleDto
  ): Promise<any> {
    return this.userService.update(id, null, roleDto);
  }

  @Patch(":id/permission")
  @ApiOperation({
    description: "Update user",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async updatePermission(
    @Param("id", ParseIntPipe) id: number,
    @Body() permissionDto: PermissionUserDto
  ): Promise<any> {
    return this.userService.updatePermisson(id, permissionDto);
  }

  @Patch(":id/block")
  @ApiOperation({
    description: "Block user",
  })
  @ApiOkResponse({
    type: Response<User>,
  })
  @UsePipes(ValidationPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async blockUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() blockDto: BlockUserDto
  ): Promise<any> {
    return this.userService.update(id, null, blockDto);
  }

  @Delete(":id")
  @ApiOperation({
    description: "Delete user",
  })
  @UseGuards(RolesGuard)
  @Roles(UserRoles.SUPPER, UserRoles.USER_UPDATE)
  async delete(@Param("id") id: number): Promise<any> {
    return this.userService.delete(id);
  }
}
