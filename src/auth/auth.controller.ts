import {
   Controller,
   Post,
   Get,
   Body,
   Req,
   UseGuards,
   UnauthorizedException,
   NotFoundException,
} from '@nestjs/common';
import {
   ApiTags,
   ApiOperation,
   ApiResponse,
   ApiBody,
   ApiBearerAuth,
   ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import { TokenService } from './tokens.service';
import { UserService } from 'src/users/user.service';

// =====================
// DTOs para documentación Swagger
// =====================

export class LoginDto {
   @ApiProperty({
      example: 'usuario@ejemplo.com',
      description: 'Correo electrónico del usuario registrado.',
   })
   correo: string;

   @ApiProperty({
      example: '123456',
      description: 'Contraseña asociada al correo.',
   })
   contrasena: string;
}

export class RefreshTokenDto {
   @ApiProperty({
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      description: 'Token de refresco emitido previamente al iniciar sesión.',
   })
   refreshToken: string;
}

// =====================
// Controlador principal
// =====================

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
   constructor(
      private readonly tokenService: TokenService,
      private readonly userService: UserService,
   ) {}

   // ============================
   // POST /auth/login
   // ============================
   @Post('login')
   @ApiOperation({
      summary: 'Inicia sesión de usuario',
      description:
         'Valida las credenciales de un usuario y devuelve un token de acceso (JWT) y un token de refresco.',
   })
   // 🎉 CAMBIO APLICADO AQUÍ
   @ApiBody({ type: LoginDto })
   @ApiResponse({
      status: 200,
      description: 'Inicio de sesión exitoso',
      schema: {
         example: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Credenciales inválidas o usuario no encontrado',
   })
   async login(@Body() dto: LoginDto): Promise<{ accessToken: string; refreshToken: string; }> {
      const usuario = await this.userService.login(dto.correo, dto.contrasena);
      if (!usuario)
         throw new UnauthorizedException('Usuario no encontrado o credenciales inválidas');

      const userProfile = {
         id: usuario.id.toString(),
         correo: usuario.correo,
         nombre: usuario.nombre,
         apellidos: usuario.apellidos,
         idRol: usuario.idRol,
      };

      const accessToken = await this.tokenService.generateAccess(userProfile);
      const refreshToken = await this.tokenService.generateRefresh(usuario.id.toString());

      return { accessToken, refreshToken };
   }

   // ... (El método getProfile no necesita cambios) ...

   // ============================
   // POST /auth/refresh
   // ============================
   @Post('refresh')
   @ApiOperation({
      summary: 'Refresca el token de acceso',
      description:
         'Recibe un token de refresco válido y devuelve un nuevo token de acceso sin necesidad de volver a iniciar sesión.',
   })
   // 🎉 ESTABA CORRECTO, pero lo confirmamos
   @ApiBody({ type: RefreshTokenDto }) 
   @ApiResponse({
      status: 200,
      description: 'Token de acceso renovado correctamente',
      schema: {
         example: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
         },
      },
   })
   @ApiResponse({
      status: 401,
      description: 'Token de refresco inválido o expirado',
   })
   async refresh(@Body() dto: RefreshTokenDto) {
      try {
         const profile = await this.tokenService.verifyRefresh(dto.refreshToken);
         const user = await this.userService.findById(Number(profile.sub));
         if (!user) throw new NotFoundException('Usuario no encontrado');

         const newAccessToken = await this.tokenService.generateAccess({
            id: user.id.toString(),
            correo: user.correo,
            nombre: user.nombre,
            idRol: user.idRol,
         });

         return { accessToken: newAccessToken };
      } catch {
         throw new UnauthorizedException('Token de refresco inválido');
      }
   }
}