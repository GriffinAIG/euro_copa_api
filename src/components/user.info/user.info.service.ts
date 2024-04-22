import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInfoDto, UpdateUserInfoDto } from "./dto/index";
import { UserInfo } from "./user.info.entity";
import {
  SuccessResponse,
  ErrorResponse,
} from "../../system/BaseResponse/index";
import { STATUSCODE, MESSAGE, ERROR } from "../../system/constants";
import { PaginationQueryDto } from "../../common/common.dto";
import { ConnectService } from "../connect/connect.service";
import { UserService } from "../user/user.service";

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private connectService: ConnectService,
    private userService: UserService
  ) {}

  private readonly logger = new Logger(UserInfoService.name);

  async getAll(paginationQueryDto: PaginationQueryDto): Promise<any> {
    const { take: perPage, skip: page, order } = paginationQueryDto;
    if (page <= 0) {
      return "The skip must be more than 0";
    }
    const skip = +perPage * +page - +perPage;
    try {
      const datas = await this.userInfoRepository.findAndCount({
        relations: ["user"],
        select: {
          id: true,
          user: {
            id: true,
            username: true,
          },
          gameType: true,
          recharge: true,
          betAmountNew: true,
          betAmountOld: true,
          createdAt: true,
          updatedAt: true,
        },
        order: { id: order },
        take: perPage,
        skip: skip,
      });

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        datas,
        MESSAGE.LIST_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        MESSAGE.LIST_FAILED
      );
    }
  }

  async getOneById(id: number): Promise<any> {
    try {
      const data = await this.userInfoRepository.findOneBy({ id });

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        data,
        MESSAGE.LIST_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_NOT_FOUND,
        error,
        ERROR.NOT_FOUND
      );
    }
  }

  async getOneByUserAndTypegame(
    userId: number,
    gameType: number
  ): Promise<any> {
    try {
      const data = await this.userInfoRepository.findOne({
        where: {
          user: { id: userId },
          gameType: gameType,
        },
      });

      return new SuccessResponse(
        STATUSCODE.COMMON_SUCCESS,
        data,
        MESSAGE.LIST_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_NOT_FOUND,
        error,
        ERROR.NOT_FOUND
      );
    }
  }

  async create(createDto: CreateUserInfoDto): Promise<any> {
    try {
      // turn sẽ đc tính dựa và có coin có trong ví hiện tại
      // sẽ chỉ lấy phần nguyên VD: 100 / 3 = 33 lần
      const COIN_FEE = createDto?.gameType == 0 ? 3 : 10;
      const user = await this.userService.getOneById(createDto?.userId);
      const availableBalance = await this.connectService.getSubWallet(
        user?.result?.username
      );
      const turnCal =
        availableBalance == 0 ? 0 : Math.floor(availableBalance / COIN_FEE);

      const newDto = {
        user: { id: createDto?.userId },
        turn: turnCal,
        gameType: createDto?.gameType,
      };
      const created = await this.userInfoRepository.create(newDto);
      created.createdAt = new Date();
      await this.userInfoRepository.save(created);

      return new SuccessResponse(
        STATUSCODE.COMMON_CREATE_SUCCESS,
        created,
        MESSAGE.CREATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.CREATE_FAILED
      );
    }
  }

  async update(id: number, updateDto: UpdateUserInfoDto): Promise<any> {
    try {
      let foundDto = await this.userInfoRepository.findOneBy({
        id,
      });

      if (!foundDto) {
        return new ErrorResponse(
          STATUSCODE.COMMON_NOT_FOUND,
          `Dto with id: ${id} not found!`,
          ERROR.NOT_FOUND
        );
      }

      foundDto = {
        ...foundDto,
        ...updateDto,
        updatedAt: new Date(),
      };
      await this.userInfoRepository.save(foundDto);

      return new SuccessResponse(
        STATUSCODE.COMMON_UPDATE_SUCCESS,
        foundDto,
        MESSAGE.UPDATE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.UPDATE_FAILED
      );
    }
  }

  async delete(id: number): Promise<any> {
    try {
      const foundDto = await this.userInfoRepository.findOneBy({
        id,
      });

      if (!foundDto) {
        return new ErrorResponse(
          STATUSCODE.COMMON_NOT_FOUND,
          `Dto with id: ${id} not found!`,
          ERROR.NOT_FOUND
        );
      }
      await this.userInfoRepository.delete(id);

      return new SuccessResponse(
        STATUSCODE.COMMON_DELETE_SUCCESS,
        `Dto has deleted id: ${id} success!`,
        MESSAGE.DELETE_SUCCESS
      );
    } catch (error) {
      this.logger.debug(
        `${UserInfoService.name} is Logging error: ${JSON.stringify(error)}`
      );
      return new ErrorResponse(
        STATUSCODE.COMMON_FAILED,
        error,
        ERROR.DELETE_FAILED
      );
    }
  }
}
