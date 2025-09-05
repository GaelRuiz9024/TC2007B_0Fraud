/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { UserModule } from "src/users/user.module";
import { AuthController } from "./auth.controller";
import { TokenService } from "./tokens.service";


@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [TokenService]
})
export class AuthModule {}