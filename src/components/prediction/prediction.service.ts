import { Injectable, Logger } from "@nestjs/common";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";
import { ERROR, MESSAGE, STATUSCODE } from "src/system/constants";
import { Prediction } from "./entities/prediction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { Match } from "../match/entities/match.entity";
import { PaginationQueryDto } from "src/common/common.dto/pagination.query.dto";
import { MatchService } from "../match/match.service";

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>
  ) { }

  private readonly logger = new Logger(PredictionService.name);

  async create(createPredictionDto: CreatePredictionDto, user: any) {
    try {
      if (createPredictionDto.mission === 1) {

        if (this.verifyMission1()) {

        }

      } else {
        const match = await this.matchRepository.findOne({
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
          },
          where: {
            id: createPredictionDto.matchId
          }
        },
        )

        if (!match) {
          return new ErrorResponse(
            STATUSCODE.COMMON_FAILED,
            "Match not existed",
            ERROR.NOT_FOUND
          );
        }

        if (!this.verifyMission2(createPredictionDto.predicted, match)) {
          return new ErrorResponse(
            STATUSCODE.COMMON_FAILED,
            "Wrong format predict",
            ERROR.NOT_FOUND
          );
        }

        const createdPrediction = this.predictionRepository.create({
          ...createPredictionDto,
          match: {
            id: createPredictionDto.matchId
          },
          user: {
            id: user?.id
          },
          createdBy: user?.name,
        });

        const savedPrediction = await this.predictionRepository.save(createdPrediction);

        return new SuccessResponse(
          STATUSCODE.COMMON_CREATE_SUCCESS,
          savedPrediction,
          MESSAGE.CREATE_SUCCESS
        );
      }

    } catch (error) {
      this.logger.debug(
        `${PredictionService.name} is Logging error: ${JSON.stringify(error)}`
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

      const listPrediction = await this.predictionRepository.findAndCount({
        relations: ["match", "user"],
        select: {
          id: true,
          mission: true,
          status: true,
          predicted: true,
          matchResult: true,
          result: true,
          match: {
            id: true,
            // teamA: {
            //   id: true,
            //   name: true,
            //   flagUrl: true,
            //   rewardTitle: true,
            //   eliminated: true,
            // },
            // teamB: {
            //   id: true,
            //   name: true,
            //   flagUrl: true,
            //   rewardTitle: true,
            //   eliminated: true,
            // },
            matchName: true,
            tournament: true,
            date: true,
            matchRound: true,
            result: true,
            status: true,
          },
          user: {
            id: true,
            username: true,

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
        listPrediction,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${PredictionService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} prediction`;
  }

  update(id: number, updatePredictionDto: UpdatePredictionDto) {
    return `This action updates a #${id} prediction`;
  }

  remove(id: number) {
    return `This action removes a #${id} prediction`;
  }

  verifyMission1(): boolean {
    return true
  }

  verifyMission2(predicted: string, match: Match): boolean {

    const [teamWinId, teamWinName, predictString] = predicted.split('-')

    if (match?.matchRound.includes('group_state')) {

      if (!teamWinId || !predictString || predictString === '' || !teamWinName || (predictString !== 'win' && predictString !== 'draw')
        || (Number(teamWinId) !== match.teamA.id && Number(teamWinId) !== match.teamB.id)) {
        return false
      }

    } else {
      if (predicted.includes('draw')) {
        return false
      }

      if (!teamWinId || !predictString || predictString === '' || (predictString !== 'win')
        || (Number(teamWinId) !== match.teamA.id && Number(teamWinId) !== match.teamB.id)) {
        return false
      }
    }

    return true
  }
}
