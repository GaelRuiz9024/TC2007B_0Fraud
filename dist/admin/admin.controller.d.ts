import { AdminDto, AdminService } from "./admin.service";
export declare class CreateAdminDto {
    correo: string;
    nombre: string;
    apellidos: string;
    contrasena: string;
}
export declare class AdminUpdateUserDto {
    correo?: string;
    nombre?: string;
    apellidos?: string;
    contrasena?: string;
}
export declare class UpdateUserRoleDto {
    idRol: number;
}
export declare class adminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    registerUser(userDto: CreateAdminDto): Promise<AdminDto | void>;
    updateUser(id: string, updateDto: AdminUpdateUserDto): Promise<AdminDto>;
    updateRole(id: string, updateRoleDto: UpdateUserRoleDto): Promise<AdminDto>;
    deleteUser(id: string): Promise<void>;
    getAllUsers(): Promise<AdminDto[]>;
    getUserById(id: string): Promise<AdminDto>;
}
