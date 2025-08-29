/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

@Module({
  controllers: [UserController],
  providers: [UserRepository,UserService],
  exports: [UserService]
})
export class UserModule {}
