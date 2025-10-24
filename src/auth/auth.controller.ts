
import { UserService } from "src/users/user.service";
import { TokenService } from "./tokens.service";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { ApiBearerAuth } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  correo: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  contrasena: string;
}
@Controller("auth")
export class AuthController{
    constructor(private readonly tokenService: TokenService,
        private readonly userService: UserService
    ){}
    
    @Post("login")
    async login(@Body() dto:LoginDto){
        const usuario= await this.userService.login(dto.correo, dto.contrasena);
        if(!usuario)
            throw Error("Usuario no encontrado");
        const userProfile = {id: usuario.id.toString(), correo: usuario.correo, nombre: usuario.nombre, apellidos: usuario.apellidos,idRol: usuario.idRol};
        const accessToken = await this.tokenService.generateAccess(userProfile);
        const refreshToken= await this.tokenService.generateRefresh(usuario.id.toString());
        return { accessToken, refreshToken };
    }

    @Get("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    getProfile(@Req() req: AuthenticatedRequest){
        return {profile: req.user.profile}
    }

    @Post("refresh")
    async refresh(@Body() dto: {refreshToken: string}){
        try{
            const profile= await this.tokenService.verifyRefresh(dto.refreshToken);
            const user= await this.userService.findById(Number(profile.sub));
            if(!user) throw Error("Usuario no encontrado");
            const newAccessToken = await this.tokenService.generateAccess({id: user.id.toString(), correo: user.correo, nombre: user.nombre, idRol: user.idRol});
            return {accessToken: newAccessToken};
        }catch{
            throw Error("Token de refresco inválido");
        }
    }

}