import { Injectable, Logger } from "@nestjs/common";
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { STATUSCODE, MESSAGE, ERROR } from "../../system/constants";
import { Team } from "../team/entities/team.entity";

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
      const createdMatch = this.matchRepository.create(
        {
          ...createMatchDto,
          createdBy: username,
          teamA: {
            id: createMatchDto.teamAId
          },
          teamB: {
            id: createMatchDto.teamBId
          }
        }
      );

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

  async findAll() {
    try {
      const listMatch = await this.matchRepository.findAndCount({
        relations: ["teamA", "teamB"],
        select: {
          id: true,
          date: true,
          matchRound: true,
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
        }
      })

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

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateTeamDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
