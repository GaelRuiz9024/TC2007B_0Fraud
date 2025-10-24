
import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    forwardRef(() => AuthModule) // Usar forwardRef para evitar dependencias circulares
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService,UserRepository]
})
export class UserModule {}