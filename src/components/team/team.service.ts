import { Injectable, Logger } from "@nestjs/common";
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { STATUSCODE, MESSAGE, ERROR } from "../../system/constants";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>
  ) { }

  private readonly logger = new Logger(TeamService.name);

  async createTeam(createTeamDto: CreateTeamDto, username: string) {
    try {
      const createdTeam = await this.teamRepository.create(
        createTeamDto
      );
      createdTeam.rewardTitle = ''
      createdTeam.eliminated = false
      createdTeam.createdBy = username


      const savedTeam = await this.teamRepository.save(createdTeam);

      return new SuccessResponse(
        STATUSCODE.COMMON_CREATE_SUCCESS,
        savedTeam,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${TeamService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  async findAll() {
    try {
      const listTeam = await this.teamRepository.findAndCount({})

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        listTeam,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${TeamService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
