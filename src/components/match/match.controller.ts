import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { Response } from "../../system/interfaces";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { RateLimitGuard } from "../auth/rate.guard/rate.limit.guard";
import { Match } from "./entities/match.entity";
import { Roles } from "../auth/roles.guard/roles.decorator";
import { UserRoles } from "../user/enums/user.enum";
import { PaginationQueryDto } from "src/common/common.dto/pagination.query.dto";

@Controller("/api/v1/match")
@ApiTags("Match")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post("create")
  @ApiOperation({
    description: "Create a Team",
  })
  @ApiOkResponse({
    type: Response<Match>,
  })
  @Roles(UserRoles.SUPPER)
  async create(
    @Request() req: any,
    @Body() createMatchDto: CreateMatchDto
  ): Promise<any> {
    return this.matchService.createMatch(createMatchDto, req?.user?.name);
  }

  @Get("all")
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
    description: "Get all SysConfigs",
  })
  @ApiOkResponse({
    type: Response<Match[]>,
  })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.matchService.findAll(paginationQueryDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.matchService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(+id, updateMatchDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.matchService.remove(+id);
  }
}
