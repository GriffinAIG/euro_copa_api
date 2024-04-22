import { Injectable, Logger } from "@nestjs/common";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { Team } from "./entities/team.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { STATUSCODE, MESSAGE, ERROR } from "../../system/constants";
import { PaginationQueryDto } from "src/common/common.dto";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>
  ) {}

  private readonly logger = new Logger(TeamService.name);

  async createTeam(createTeamDto: CreateTeamDto, username: string) {
    try {
      const listTeam = await this.teamRepository.find({});
      if (
        listTeam.some(
          (team) =>
            team?.name.toLowerCase() === createTeamDto?.name.toLowerCase()
        )
      ) {
        return new ErrorResponse(
          STATUSCODE.COMMON_FAILED,
          "team already existed",
          ERROR.CREATE_FAILED
        );
      }

      const createdTeam = await this.teamRepository.create(createTeamDto);
      createdTeam.rewardTitle = "";
      createdTeam.eliminated = false;
      createdTeam.createdBy = username;

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

  async findAll(paginationQueryDto: PaginationQueryDto) {
    try {
      const object: any = JSON.parse(paginationQueryDto.keyword); //use when where

      const { take: perPage, skip: page } = paginationQueryDto;
      if (page <= 0) {
        return "The skip must be more than 0";
      }
      const skip = +perPage * +page - +perPage;

      const listTeam = await this.teamRepository.findAndCount({
        take: +perPage,
        skip,
        order: { id: paginationQueryDto.order },
      });

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
