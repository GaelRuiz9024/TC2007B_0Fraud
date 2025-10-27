
import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import {type UserDto, UserService } from "./user.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";

export class CreateUserDto{
    @ApiProperty({example:"user@example.com", description:"correo del usuario"})
    correo: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del usuario", required:false})
    nombre: string;
    @ApiProperty({example:"Apellido Ejemplo", description:"Apellidos del usuario", required:false})
    apellidos: string;
    @ApiProperty({example:"contrsaena123", description:"Contraseña del usuario"})
    contrasena: string;
}

export class UpdateUserDto{
    @ApiProperty({example:"newcorreo@example.com", description:"Nuevo correo del usuario", required: false})
    correo?: string;
    @ApiProperty({example:"Nuevo Nombre", description:"Nuevo nombre del usuario", required: false})
    nombre?: string;
    @ApiProperty({example:"Apellido Ejemplo", description:"Apellidos del usuario", required:false})
    apellidos?: string;
    @ApiProperty({example:"newcontrsaena123", description:"Nueva contraseña del usuario", required: false})
    contrasena?: string;
}
export class UserResponseDto {
    @ApiProperty({ example: "user@example.com", description: "Correo del usuario" })
    correo: string;

    @ApiProperty({ example: "Usuario Ejemplo", description: "Nombre del usuario", required: false })
    nombre?: string;

    @ApiProperty({ example: "Apellido Ejemplo", description: "Apellidos del usuario", required: false })
    apellidos?: string;
    
}

@ApiTags("Endpoints de Usuarios")
@Controller("users")
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo usuario' }) 
    @ApiResponse({status: 201, description: "Usuario creado exitosamente", type: UserResponseDto}) 
    @ApiResponse({status: 400, description: "El correo ya está en uso o los datos son inválidos"}) 
    @ApiResponse({status: 201, description: "Usuario creado exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateUserDto): Promise<UserDto|void> {
        return this.userService.registerUser(userDto.correo, userDto.nombre, userDto.apellidos, userDto.contrasena);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar el perfil del usuario autenticado' }) 
    @ApiResponse({status: 200, description: "Usuario actualizado exitosamente", type: UserResponseDto}) 
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async updateUser(@Req() req: AuthenticatedRequest, @Body() updateDto: UpdateUserDto): Promise<UserDto> {
        const userId = Number(req.user.userId);
        return this.userService.updateUser(userId, updateDto);
    }
}