import { Injectable, Logger } from "@nestjs/common";
import { CreateMatchDto } from "./dto/create-match.dto";
import { UpdateMatchDto } from "./dto/update-match.dto";
import { Match } from "./entities/match.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { STATUSCODE, MESSAGE, ERROR } from "../../system/constants";
import { Team } from "../team/entities/team.entity";
import { PaginationQueryDto } from "src/common/common.dto/pagination.query.dto";

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>
  ) { }

  private readonly logger = new Logger(MatchService.name);

  async createMatch(createMatchDto: CreateMatchDto, username: string) {
    try {
      const matchFind = await this.matchRepository.findOneBy({
        teamA: {
          id: createMatchDto.teamAId
        },
        teamB: {
          id: createMatchDto.teamBId
        }
      });
      if (matchFind) {
        return new ErrorResponse(
          STATUSCODE.COMMON_FAILED,
          "match already existed",
          ERROR.CREATE_FAILED
        );
      }

      const createdMatch = this.matchRepository.create({
        ...createMatchDto,
        matchName: `${createMatchDto.teamAName}-${createMatchDto.teamBName}`,
        createdBy: username,
        teamA: {
          id: createMatchDto.teamAId,
        },
        teamB: {
          id: createMatchDto.teamBId,
        },
      });

      const savedMatch = await this.matchRepository.save(createdMatch);

      return new SuccessResponse(
        STATUSCODE.COMMON_CREATE_SUCCESS,
        savedMatch,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${MatchService.name} is Logging error: ${JSON.stringify(error)}`
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

      const listMatch = await this.matchRepository.findAndCount({
        relations: ["teamA", "teamB"],
        select: {
          id: true,
          date: true,
          matchRound: true,
          matchName: true,
          tournament: true,
          result: true,
          status: true,
          teamA: {
            id: true,
            name: true,
            flagUrl: true,
            rewardTitle: true,
            eliminated: true,
          },
          teamB: {
            id: true,
            name: true,
            flagUrl: true,
            rewardTitle: true,
            eliminated: true,
          },
          isDeleted: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
        },
        take: +perPage,
        skip,
        order: { id: paginationQueryDto.order },
      });

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        listMatch,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${MatchService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  async findOne(id: number) {
    try {
      const match = await this.matchRepository.findOne({
        relations: ["teamA", "teamB"],
        select: {
          id: true,
          date: true,
          matchRound: true,
          matchName: true,
          tournament: true,
          result: true,
          status: true,
          teamA: {
            id: true,
            name: true,
            flagUrl: true,
            rewardTitle: true,
            eliminated: true,
          },
          teamB: {
            id: true,
            name: true,
            flagUrl: true,
            rewardTitle: true,
            eliminated: true,
          },
          isDeleted: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
        },
        where: {
          id: id
        }
      });

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        match,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${MatchService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  update(id: number, updateTeamDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
