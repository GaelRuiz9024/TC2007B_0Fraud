/* eslint-disable prettier/prettier */

import { Module, forwardRef } from "@nestjs/common";
import { UserModule } from "src/users/user.module";
import { AuthController } from "./auth.controller";
import { TokenService } from "./tokens.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        forwardRef(() => UserModule), // Usar forwardRef aquí también
        JwtModule.register({}) // Registrar JwtModule si no está registrado globalmente
    ],
    controllers: [AuthController],
    providers: [TokenService],
    exports: [TokenService] // Exportar TokenService para que otros módulos puedan usarlo
})
export class AuthModule {}