import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Response } from "../../system/interfaces";
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RateLimitGuard } from '../auth/rate.guard/rate.limit.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Team } from './entities/team.entity';
import { Roles } from '../auth/roles.guard/roles.decorator';
import { UserRoles } from '../user/enums/user.enum';

@Controller("/api/v1/team")
@ApiTags("Team")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post("create")
  @ApiOperation({
    description: "Create a Team",
  })
  @ApiOkResponse({
    type: Response<Team>,
  })
  @Roles(UserRoles.SUPPER)
  async create(@Request() req: any, @Body() createTeamDto: CreateTeamDto): Promise<any> {
    return this.teamService.createTeam(createTeamDto, req?.user?.name);
  }

  @Get("all")
  async findAll(): Promise<any> {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
