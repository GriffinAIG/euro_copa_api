import { BacklistModule } from "../backlist/backlist.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserInfo } from "./user.info.entity";
import { UserInfoController } from "./user.info.controller";
import { UserInfoService } from "./user.info.service";
import { UserModule } from "../user/user.module";
import { ConnectModule } from "../connect/connect.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    BacklistModule,
    UserModule,
    ConnectModule,
  ],
  controllers: [UserInfoController],
  providers: [UserInfoService],
})
export class UserInfoModule {}
