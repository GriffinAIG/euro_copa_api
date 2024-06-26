import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../components/user/user.entity";
import { API } from "../api.third/api.entity";
import { BacklistModule } from "../backlist/backlist.module";
import { EventTimeModule } from "../event.time.third/event.time.third.module";
import { EventTime } from "./../event.time.third/event.time.third.entity";
import { ConnectController } from "./connect.controller";
import { ConnectService } from "./connect.service";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([API, EventTime, User]),
    BacklistModule,
    EventTimeModule,
  ],
  controllers: [ConnectController],
  providers: [ConnectService],
  exports: [ConnectService],
})
export class ConnectModule {}
