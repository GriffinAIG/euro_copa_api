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
import { PredictionService } from "./prediction.service";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { RateLimitGuard } from "../auth/rate.guard/rate.limit.guard";
import { Prediction } from "./entities/prediction.entity";
import { Roles } from "../auth/roles.guard/roles.decorator";
import { UserRoles } from "../user/enums/user.enum";
import { PaginationQueryDto } from "src/common/common.dto/pagination.query.dto";

@Controller("/api/v1/prediction")
@ApiTags("Prediction")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) { }

  @Post("create")
  @ApiOperation({
    description: "Create a prediction",
  })
  @ApiOkResponse({
    type: Response<Prediction>,
  })
  @Roles(UserRoles.MEMBER)
  async create(
    @Request() req: any,
    @Body() createPredictionDto: CreatePredictionDto): Promise<any> {
    return this.predictionService.create(createPredictionDto, req?.user);
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
    type: Response<Prediction[]>,
  })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.predictionService.findAll(paginationQueryDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.predictionService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePredictionDto: UpdatePredictionDto
  ) {
    return this.predictionService.update(+id, updatePredictionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.predictionService.remove(+id);
  }
}
