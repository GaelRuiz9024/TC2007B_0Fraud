
import { UserService } from "src/users/user.service";
import { TokenService } from "./tokens.service";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from "@nestjs/swagger";import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo debe ser una dirección de correo válida.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  correo: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  contrasena: string;
}
export class RefreshTokenDto {
  @ApiProperty({ description: 'Token de refresco (Refresh Token) válido' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

@ApiTags('Autenticación') 
@Controller("auth")
export class AuthController{
    constructor(private readonly tokenService: TokenService,
        private readonly userService: UserService
    ){}
    
    @Post("login")
    @ApiOperation({ summary: 'Iniciar sesión y obtener tokens de acceso y refresco' }) 
    @ApiBody({ type: LoginDto }) 
    @ApiResponse({ status: 200, description: 'Login exitoso. Devuelve accessToken y refreshToken.' }) 
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas o usuario no encontrado.' }) 
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
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' }) 
    @ApiResponse({ status: 200, description: 'Perfil del usuario obtenido.' }) 
    @ApiResponse({ status: 401, description: 'No autorizado (Token inválido o ausente).' }) 
    getProfile(@Req() req: AuthenticatedRequest){
        return {profile: req.user.profile}
    }

    @Post("refresh")
    @ApiOperation({ summary: 'Refrescar el token de acceso usando un refresh token' }) 
    @ApiBody({ type: RefreshTokenDto }) 
    @ApiResponse({ status: 200, description: 'Nuevo token de acceso (accessToken) generado.' }) 
    @ApiResponse({ status: 401, description: 'Token de refresco inválido o expirado.' }) 
    async refresh(@Body() dto: RefreshTokenDto){
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