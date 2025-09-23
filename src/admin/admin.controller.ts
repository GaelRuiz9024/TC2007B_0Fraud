import { Body, Controller, Post, Put, Req, UseGuards, Param, Get } from "@nestjs/common";
import { AdminDto, AdminService } from "./admin.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { IsAdminGuard } from "src/common/guards/is-admin.guard";

export class CreateAdminDto{
    @ApiProperty({example:"user@example.com", description:"correo del administrador"})
    correo: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del administrador", required:false})
    nombre: string;
    @ApiProperty({example:"contrasena123", description:"Contraseña del administrador"})
    contrasena: string;
}

export class UpdateUserDto{
    @ApiProperty({example:"newcorreo@example.com", description:"Nuevo correo del administrador", required: false})
    correo?: string;
    @ApiProperty({example:"Nuevo Nombre", description:"Nuevo nombre del administrador", required: false})
    nombre?: string;
    @ApiProperty({example:"newcontrasena123", description:"Nueva contraseña del administrador", required: false})
    contrasena?: string;
}

@ApiTags("Endpoints de Administradores")
@Controller("admin")
export class adminController{
    constructor(private readonly adminService: AdminService) {}
    @Post()
    @ApiResponse({status: 201, description: "Cuenta de administrador creada exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateAdminDto): Promise<AdminDto | void> {
        const admin = await this.adminService.registerAdmin(userDto.correo, userDto.nombre, userDto.contrasena);
        if (!admin) return;

        return {
            correo: admin.correo,
            nombre: admin.nombre
        };
    }


    @Put(":id")
    @UseGuards(IsAdminGuard)
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
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: "Lista de usuarios obtenida exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
 
    async getAllUsers(): Promise<AdminDto[]> {
        return this.adminService.getAllUsers();
    }


    @Get("user/:id")
    @UseGuards(IsAdminGuard)
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
