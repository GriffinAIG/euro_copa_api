import { HttpService } from "@nestjs/axios";
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { firstValueFrom, map } from "rxjs";
import { Repository } from "typeorm";
import { Logger } from "winston";
import { PaginationQueryDto } from "../../common/common.dto";
import { Debug } from "../../common/helper/debug";
import { ConfigSys, Helper } from "../../common/helper/index";
import { UserRoles } from "../../components/user/enums/user.enum";
import { User } from "../../components/user/user.entity";
import { Order } from "../../system/constants";
import { ErrorResponse } from "../../system/interfaces";
import { API } from "../api.third/api.entity";
import { EventTimeService } from "../event.time.third/event.time.third.service";
import { EventTime } from "./../event.time.third/event.time.third.entity";
import { GameTypeEnum, NameGamTypeEnum } from "./../game.type/game.type.enum";
import { ConectEnum } from "./connect.enum";

@Injectable()
export class ConnectService {
  /***
   * Fetch database
   */
  private body: any = {};

  private options: any = {
    headers: {
      "Accept-Encoding": "gzip,deflate,compress",
      "accept-language": "vi-VN,vi",
    },
  };

  private url = "";

  private start = "";

  private end = "";

  private action = "";

  /**
   * Fetch .evn file
   */
  private department = "";

  private gameName = "";

  private multiple = 0;

  private remark = "";

  private password = "";

  private actions = [
    `${ConectEnum.LOGIN}`,
    `${ConectEnum.UPDATE}`,
    `${ConectEnum.GET}`,
    `${ConectEnum.PAYMENT}`,
    `${ConectEnum.VERIFY}`,
  ];

  private vips: any = [];

  constructor(
    @InjectRepository(API)
    private apiRepository: Repository<API>,
    @InjectRepository(EventTime)
    private eventTimeRepository: Repository<EventTime>,
    private readonly httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject("winston")
    private readonly logger: Logger,
    private eventTimeService: EventTimeService
  ) {
    this.vips = process.env.VIP_LIST.split(",");
    dotenv.config();
  }

  getDep() {
    return this.department;
  }

  setDep(department: string) {
    this.department = department;
  }

  async getMultiple() {
    try {
      // const multipleConfig = await this.sysConfigRepository.findOneBy({
      //   module: SYS_MODULE_ENUM.MULTIPLE,
      //   item: SYS_ITEM_ENUM.MULTIPLE,
      //   isDeleted: false,
      // });

      // if (!multipleConfig) return this.multiple;
      // const value = multipleConfig.value;
      // return parseInt(value, 10) ? parseInt(value, 10) : this.multiple;
      return this.multiple;
    } catch (error) {
      return this.multiple;
    }
  }

  setMultiple(multiple: number) {
    this.multiple = multiple;
  }

  getRemark() {
    return this.remark;
  }

  setRemark(remark: string) {
    this.remark = remark;
  }

  getGameName() {
    return this.gameName;
  }

  setGameName(gameName: string) {
    this.gameName = gameName;
  }

  getURL() {
    return this.url;
  }

  setURL(url: string) {
    this.url = url;
  }

  getAction() {
    return this.action;
  }

  setAction(action: string) {
    this.action = action;
  }

  getBody() {
    return this.body;
  }

  setBody(data: any) {
    this.body = data;
  }

  setStart(start: Date) {
    this.start = Helper.convertTime(start);
  }

  setEnd(end: Date) {
    this.end = Helper.convertTime(end);
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  async update(userName = "", awardAmount = 0, multiple = 0) {
    const paginationQueryDto: PaginationQueryDto = {
      take: 1,
      skip: 1,
      order: Order.DESC,
      keyword: null,
    };
    const event = await this.eventTimeService.getAll(paginationQueryDto);

    if (event.length >= 1) {
      const today = new Date(event[0]?.result?.start);
      this.setRemark(`LUCKYWHEEL_${Helper.convertTime(today)}`);
    } else {
      const today = new Date();
      this.setRemark(`LUCKYWHEEL_${Helper.convertTime(today)}`);
    }

    await this.compose(ConectEnum.UPDATE);
    await this.bodyUpdate(userName, awardAmount, multiple);
    return this.connect();
  }

  async logIn(userName = ""): Promise<any> {
    await this.compose(ConectEnum.LOGIN);

    const gameType = this.getGameType();

    for (const index in gameType) {
      this.bodyLogin(userName, gameType[index].type);
      const data = await this.connect();
      const isUser =
        Debug.typeOf(data?.code) === "Number" &&
        data?.code == 0 &&
        this.vips.includes(data?.data.level);
      if (isUser) {
        await this.checkUser(userName);
        return data;
      }
      if (data?.data?.level && !this.vips.includes(data?.data?.level)) {
        throw new ErrorResponse(HttpStatus.OK, false, `VIP is wrong`);
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: data,
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  async verifyBank(userName = ""): Promise<any> {
    await this.compose(ConectEnum.VERIFY);

    this.bodyVerify(userName);
    const data = await this.connect();
    if (!data?.data?.data?.certificationType) {
      throw new ErrorResponse(
        HttpStatus.OK,
        false,
        `Account has not been verified by the bank`
      );
    } else {
      return data;
    }
  }

  bodyVerify(userName = "") {
    const data = {
      userName,
      sign: Helper.endCode(userName),
    };
    this.setBody(data);
  }

  // async loginWithCondition(userName = ""): Promise<any> {
  //   let userCondition = getConditionDefault();
  //   const userConditionConfig = await this.userConditionRepository.findOneBy({
  //     isDeleted: false,
  //   });

  //   if (userConditionConfig) {
  //     userCondition = userConditionConfig;
  //   }
  //   await this.compose(ConectEnum.LOGIN);

  //   const data = await this.fetchWithCondition(userName, userCondition);
  //   if (!data || data.length != 5) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: data,
  //       },
  //       HttpStatus.NOT_FOUND
  //     );
  //   }

  //   const recharge = data[0]?.data?.totalRechargeAmount;
  //   let amount = 0;
  //   for (const index in data) {
  //     amount += data[index]?.data?.totalValidBetAmount;
  //   }

  //   if (
  //     amount < userCondition.revenue ||
  //     recharge < userCondition.deposit ||
  //     !this.vips.includes(data[0]?.data?.level)
  //   ) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         message: `Unconditional account`,
  //       },
  //       HttpStatus.NOT_FOUND
  //     );
  //   }
  //   const isUser =
  //     Debug.typeOf(data[0]?.code) === "Number" &&
  //     data[0]?.code == 0 &&
  //     this.vips.includes(data[0]?.data?.level);
  //   if (isUser) {
  //     await this.checkUser(userName);
  //   }
  //   return data[0];
  // }

  async fetch(userName = ""): Promise<any> {
    await this.compose(ConectEnum.LOGIN);

    const gameType = this.getGameType();
    const collections = [];

    for (const index in gameType) {
      this.bodyLogin(userName, gameType[index].type);
      const data = await this.connect();

      if (Debug.typeOf(data?.code) === "Number" && data?.code == 0) {
        collections.push(data);
      }
    }

    if (gameType.length == collections.length) {
      return collections;
    }

    return [];
  }

  async fetchSubWallet(userName = ""): Promise<any> {
    await this.compose(ConectEnum.GET);
    this.bodyGetSubWalletInfo(userName);
    const data = await this.connect();
    return data;
  }

  async getDeposit(userName = ""): Promise<number> {
    await this.compose(ConectEnum.LOGIN);
    const gameType = this.getGameType();

    for (const index in gameType) {
      this.bodyLogin(userName, gameType[index].type);
      const data = await this.connect();
      if (Debug.typeOf(data?.code) === "Number" && data?.code == 0) {
        return data?.data?.totalRechargeAmount;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: data,
          },
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  async getDepositAndRevenue(userName = ""): Promise<any> {
    await this.compose(ConectEnum.LOGIN);
    const data = await this.fetch(userName);
    const deposit = data[0]?.data?.totalRechargeAmount;
    let revenue = 0;

    for (const index in data) {
      revenue += data[index]?.data?.totalValidBetAmount;
    }
    return { deposit, revenue };
  }

  async getSubWallet(userName = ""): Promise<any> {
    await this.compose(ConectEnum.GET);
    const data = await this.fetchSubWallet(userName);
    let availableBalance = 0;
    if (
      data?.data?.result?.subWallets?.length > 0 &&
      data?.data?.result?.subWallets[0]?.availableBalance
    ) {
      availableBalance = data.data.result.subWallets[0].availableBalance;
    }
    return availableBalance;
  }

  async paymentSubWallet(
    userName = "",
    amount = 0,
    transRef1 = ""
  ): Promise<any> {
    await this.compose(ConectEnum.PAYMENT);
    this.bodyPaymentSubWallet(userName, amount, transRef1);
    const data = await this.connect();
    return data;
  }

  // async fetchWithCondition(
  //   userName: string,
  //   condition: UserCondition
  // ): Promise<any> {
  //   if (!userName) {
  //     userName = "";
  //   }
  //   await this.compose(ConectEnum.LOGIN);

  //   const gameType = this.getGameType();
  //   const collections = [];

  //   for (const index in gameType) {
  //     this.bodyLoginWithCondition(userName, gameType[index].type, condition);
  //     const data = await this.connect();

  //     if (Debug.typeOf(data?.code) === "Number" && data?.code == 0) {
  //       collections.push(data);
  //     } else {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.NOT_FOUND,
  //           error: data,
  //         },
  //         HttpStatus.NOT_FOUND
  //       );
  //     }
  //   }

  //   if (gameType.length == collections.length) {
  //     return collections;
  //   }

  //   return [];
  // }

  async compose(action = "") {
    this.getConfig();
    await this.preConnect(action);
  }

  async connect(): Promise<any> {
    try {
      const data = await firstValueFrom(
        this.httpService
          .post(this.getURL(), this.getBody(), this.options)
          .pipe(map((resp: any) => resp.data))
      );

      return data;
    } catch (error) {
      this.logger.error(
        `${JSON.stringify(
          new ErrorResponse(
            HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            error,
            this.getURL()
          )
        )}`
      );
      throw new HttpException(
        {
          status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
          error: error,
        },
        HttpStatus.NON_AUTHORITATIVE_INFORMATION
      );
    }
  }

  async preConnect(action = "") {
    if (!this.actions.includes(action)) {
      return "The action does not exists";
    }

    const api = await this.getDataApi(action);
    if (api == 9404) {
      return `Not found the ${action} or data of API `;
    }
  }

  async postLogin(data: any): Promise<any> {
    return new Promise((resolve) => {
      data.subscribe(
        (res: any) => resolve(res),
        (err: any) => {
          this.logger.debug(
            `${ConnectService.name} is Logging error: ${JSON.stringify(err)}`
          );

          return err;
        }
      );
    });
  }

  bodyLogin(userName = "", gameType = 0) {
    this.setStart(Helper.getDate().yesterday);
    this.setEnd(Helper.getDate().today);
    const data = {
      userName,
      startTime: this.getStart(),
      endTime: this.getEnd(),
      gameType: gameType,
      sign: Helper.endCode(
        `${userName}|${this.getStart()}|${this.getEnd()}|${gameType}`
      ),
    };
    this.setBody(data);
  }

  bodyGetSubWalletInfo(username = "") {
    const data = {
      username,
      fromDate: new Date(),
      toDate: new Date(),
      gamesCode: [process.env.GAME_CODE],
      sign: Helper.endCode(`${username}|${this.getStart()}|${this.getEnd()}`),
    };
    this.setBody(data);
  }

  bodyPaymentSubWallet(username = "", amount = 0, transRef1 = "") {
    const data = {
      username,
      amount,
      transRef1,
      note: "Vòng quay may mắn",
      gameCode: process.env.GAME_CODE,
      signature: "tets",
      sign: Helper.endCode(`${username}|${this.getStart()}|${this.getEnd()}`),
    };
    this.setBody(data);
  }

  // bodyLoginWithCondition(
  //   userName: string,
  //   gameType: number,
  //   condition: UserCondition
  // ) {
  //   if (!gameType) gameType = 0;
  //   this.setStart(condition.fromDate);
  //   this.setEnd(condition.toDate);
  //   const data = {
  //     userName,
  //     startTime: this.getStart(),
  //     endTime: this.getEnd(),
  //     gameType: gameType,
  //     sign: Helper.endCode(
  //       `${userName}|${this.getStart()}|${this.getEnd()}|${gameType}`
  //     ),
  //   };
  //   this.setBody(data);
  // }

  async bodyUpdate(userName = "", awardAmount = 0, multiple = 0) {
    if (multiple == 0) {
      multiple = await this.getMultiple();
    }
    const data = {
      userName,
      awardAmount,
      multiple: multiple,
      remark: this.getRemark(),
      sign: Helper.endCode(`${userName}|${awardAmount}|${multiple}`),
    };
    this.setBody(data);
  }

  async getEventTime(isTest = 0) {
    if (isTest) {
      this.getConfig();
    }
    const data = await this.eventTimeRepository.find({
      where: {
        gameName: this.getGameName(),
        department: this.getDep(),
        isDeleted: 0,
      },
    });
    const firstItem = data.filter((x) => typeof x !== undefined).shift();
    if (!firstItem) {
      return 9404;
    }

    this.setStart(firstItem.start);
    this.setEnd(firstItem.end);

    return 9200;
  }

  async getDataApi(action = "", isTest = 0) {
    if (isTest) {
      this.getConfig();
    }
    const data = await this.apiRepository.find({
      where: {
        action,
        department: this.getDep(),
        isDeleted: 0,
        isActive: 1,
      },
    });
    const firstItem = data.filter((x) => typeof x !== undefined).shift();

    if (!firstItem) {
      return 9404;
    }

    this.setAction(firstItem?.action);
    this.setURL(firstItem?.api);

    return 9200;
  }

  getConfig() {
    const config = ConfigSys.config();

    if (!config) {
      return "Not found a configuration!";
    }
    this.setDep(config.department);
    this.setGameName(config.gameName);
    this.setMultiple(+config.multiple);
  }

  async checkUser(username = "") {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (user && !user?.role.includes(UserRoles.MEMBER)) {
      throw new ForbiddenException("Access Denied");
    }

    // if (!user) {
    //   const createUser = {
    //     username,
    //     role: UserRoles.MEMBER,
    //     password: this.password,
    //     isBlocked: false,
    //   };
    //   const createdUser = await this.userRepository.create(createUser);
    //   await this.userRepository.save(createdUser);
    //   this.logger.debug(`${ConnectService.name} create user: OK}`);
    // }
  }

  async checkUserVipInfo(userName = ""): Promise<string> {
    await this.compose(ConectEnum.LOGIN);

    const gameType = this.getGameType();

    for (const index in gameType) {
      this.bodyLogin(userName, gameType[index].type);
      const data = await this.connect();
      const isUser =
        Debug.typeOf(data?.code) === "Number" &&
        data?.code == 0 &&
        this.vips.includes(data?.data.level);
      if (isUser) return data?.data.level;
      return null;
    }
  }

  getGameType() {
    return [
      {
        type: GameTypeEnum.NO_HU,
        name: NameGamTypeEnum.NO_HU,
      },
      {
        type: GameTypeEnum.GAME_VIET,
        name: NameGamTypeEnum.GAME_VIET,
      },
      {
        type: GameTypeEnum.BAN_CA,
        name: NameGamTypeEnum.BAN_CA,
      },
      {
        type: GameTypeEnum.CASINO,
        name: NameGamTypeEnum.CASINO,
      },
      {
        type: GameTypeEnum.THE_THAO,
        name: NameGamTypeEnum.THE_THAO,
      },
    ];
  }
}
