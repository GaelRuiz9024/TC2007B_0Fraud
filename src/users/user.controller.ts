/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { UserDto, UserService } from "./user.service";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";

export class CreateUserDto{
    @ApiProperty({example:"user@example.com", description:"Email del usuario"})
    email: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del usuario", required:false})
    name: string;
    @ApiProperty({example:"password123", description:"Contraseña del usuario"})
    password: string;
}

@ApiTags("Endpoints de Usuarios")
@Controller("users")
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({status: 201, description: "Usuario creado exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateUserDto): Promise<UserDto|void> {
        return this.userService.registerUser(userDto.email, userDto.name, userDto.password);
    }

}
