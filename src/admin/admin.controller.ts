import { Body, Controller, Post, Put, Req, UseGuards, Param, Get } from "@nestjs/common";
import { AdminDto, AdminService } from "./admin.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";

export class CreateAdminDto{
    @ApiProperty({example:"user@example.com", description:"Email del administrador"})
    email: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del administrador", required:false})
    name: string;
    @ApiProperty({example:"password123", description:"Contraseña del administrador"})
    password: string;
}

export class UpdateUserDto{
    @ApiProperty({example:"newemail@example.com", description:"Nuevo email del administrador", required: false})
    email?: string;
    @ApiProperty({example:"Nuevo Nombre", description:"Nuevo nombre del administrador", required: false})
    name?: string;
    @ApiProperty({example:"newpassword123", description:"Nueva contraseña del administrador", required: false})
    password?: string;
}

@ApiTags("Endpoints de Administradores")
@Controller("admin")
export class adminController{
    constructor(private readonly adminService: AdminService) {}
    @Post()
    @ApiResponse({status: 201, description: "Cuenta de administrador creada exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateAdminDto): Promise<AdminDto|void> {
        return this.adminService.registerAdmin(userDto.email, userDto.name, userDto.password);
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "usuario actualizado exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async updateUser( @Param("id") id: string, @Body() updateDto: UpdateUserDto): Promise<AdminDto> {
        const userId = Number(id);
        return this.adminService.updateUserAdmin(userId, updateDto);
    }

    @Get("user/list")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Lista de usuarios obtenida exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async getAllUsers():Promise<AdminDto>{
        return this.adminService.getAllUsers();
    }

    @Get("user/:id")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Usuario obtenido exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async getUserById(@Param("id") id: string):Promise<AdminDto>{
        const userId = Number(id);
        return this.adminService.findById(userId);
    }
}
