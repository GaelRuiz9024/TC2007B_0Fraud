
import { Module, forwardRef } from "@nestjs/common";
import { adminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AuthModule } from "src/auth/auth.module";
import { AdminService } from "./admin.service";
import { UserModule } from "src/users/user.module";

@Module({
  imports: [
    forwardRef(() => AuthModule), 
    UserModule
  ],
  controllers: [adminController],
  providers: [AdminRepository, AdminService],
  exports: [AdminService]
})
export class AdminModule {}