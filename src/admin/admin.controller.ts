import { Body, Controller, Post, Put, Req, Delete, UseGuards, Param, Get } from "@nestjs/common";
import { AdminDto, AdminService } from "./admin.service";
import { ApiProperty, ApiResponse, ApiTags, ApiBearerAuth, ApiOperation,ApiBody, ApiParam } from "@nestjs/swagger";
import { IsAdminGuard } from "src/common/guards/is-admin.guard";
import { IsIn, IsInt, IsNotEmpty } from "class-validator";

export class CreateAdminDto{
    @ApiProperty({example:"user@example.com", description:"correo del administrador"})
    correo: string;
    @ApiProperty({example:"Usuario Ejemplo", description:"Nombre del administrador", required:false})
    nombre: string;
    @ApiProperty({example:"Apellido Ejemplo", description:"Apellidos del administrador", required:false})
    apellidos: string;
    @ApiProperty({example:"contrasena123", description:"Contraseña del administrador"})
    contrasena: string;
}

export class AdminUpdateUserDto{
    @ApiProperty({example:"newcorreo@example.com", description:"Nuevo correo del administrador", required: false})
    correo?: string;
    @ApiProperty({example:"Nuevo Nombre", description:"Nuevo nombre del administrador", required: false})
    nombre?: string;
    @ApiProperty({example:"Apellido Ejemplo", description:"Apellidos del administrador", required:false})
    apellidos?: string;
    @ApiProperty({example:"newcontrasena123", description:"Nueva contraseña del administrador", required: false})
    contrasena?: string;
}
export class UpdateUserRoleDto {
    @ApiProperty({ example: 2, description: 'Nuevo ID de Rol (1: Admin, 2: User)', enum: [1, 2] })
    @IsNotEmpty()
    @IsInt()
    @IsIn([1, 2])
    idRol: number;
}
export class AdminResponseDto {
    @ApiProperty({example:"admin@example.com", description:"Correo del administrador"})
    correo: string;
    @ApiProperty({example:"Admin Ejemplo", description:"Nombre del administrador"})
    nombre: string;
}
@ApiTags("Endpoints de Administradores")
@Controller("admin")
export class adminController{
    constructor(private readonly adminService: AdminService) {}
    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo administrador' }) 
    @ApiBody({ type: CreateAdminDto })
    @ApiResponse({status: 201, description: "Cuenta de administrador creada exitosamente"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async registerUser(@Body() userDto: CreateAdminDto): Promise<AdminDto | void> {
        const admin = await this.adminService.registerAdmin(userDto.correo, userDto.nombre, userDto.apellidos, userDto.contrasena);
        if (!admin) return;

        return {
            correo: admin.correo,
            nombre: admin.nombre,
        };
    }


    @Put("user/:id")
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar datos de un usuario por ID (Admin)' }) 
    @ApiParam({ name: 'id', description: 'ID numérico del usuario a actualizar', type: Number }) 
    @ApiResponse({status: 200, description: "usuario actualizado exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async updateUser( @Param("id") id: string, @Body() updateDto: AdminUpdateUserDto): Promise<AdminDto> {
        const userId = Number(id);
        return this.adminService.updateUserAdmin(userId, updateDto);
    }

    @Put("user/:id/role")
    @UseGuards(IsAdminGuard) 
    @ApiBearerAuth() 
    @ApiOperation({ summary: 'Actualizar el rol de un usuario por ID (Admin)' })
    @ApiResponse({status: 200, description: "Rol de usuario actualizado exitosamente"})
    @ApiResponse({status: 401, description: "No autorizado"}) 
    @ApiResponse({status: 403, description: "Prohibido (No es admin)"}) 
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    async updateRole(@Param("id") id: string, @Body() updateRoleDto: UpdateUserRoleDto): Promise<AdminDto> {
        const userId = Number(id);
        return this.adminService.updateRole(userId, updateRoleDto.idRol);
    }
    
    @Delete("user/:id")
    @UseGuards(IsAdminGuard) 
    @ApiBearerAuth() 
    @ApiOperation({ summary: 'Eliminar un usuario por ID (Admin)' })
    @ApiResponse({status: 200, description: "Usuario eliminado exitosamente"}) 
    @ApiResponse({status: 403, description: "Prohibido (No es admin)"}) 
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    async deleteUser(@Param("id") id: string): Promise<void> {
        const userId = Number(id);
        await this.adminService.deleteUser(userId);
    }
    

    @Get("user/list")
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener lista de todos los usuarios (Admin)' }) 
@ApiResponse({status: 200, description: "usuario actualizado exitosamente", type: AdminResponseDto})    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
 
    async getAllUsers(): Promise<AdminDto[]> {
        return this.adminService.getAllUsers();
    }


    @Get("user/:id")
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener un usuario por ID (Admin)' })
    @ApiParam({ name: 'id', description: 'ID numérico del usuario a buscar', type: Number }) 
    @ApiResponse({status: 200, description: "Usuario obtenido exitosamente", type: AdminResponseDto}) 
    @ApiResponse({status: 401, description: "No autorizado"})
    @ApiResponse({status: 404, description: "Usuario no encontrado"})
    @ApiResponse({status: 500, description: "Error interno del servidor"})
    async getUserById(@Param("id") id: string):Promise<AdminDto>{
        const userId = Number(id);
        return this.adminService.findById(userId);
    }
}
