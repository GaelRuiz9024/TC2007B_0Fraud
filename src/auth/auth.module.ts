
import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "src/users/user.module";
import { AuthController } from "./auth.controller";
import { TokenService } from "./tokens.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        forwardRef(() => UserModule), 
        JwtModule.register({}) 
    ],
    controllers: [AuthController],
    providers: [TokenService],
    exports: [TokenService] 
})
export class AuthModule {}