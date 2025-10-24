import { Admin, AdminRepository } from "./admin.repository";
import { UpdateUserData, UserService, UserDto } from "src/users/user.service";
export type AdminDto = {
    correo: string;
    nombre: string;
};
export declare class AdminService {
    private readonly adminRepository;
    private readonly userDto;
    constructor(adminRepository: AdminRepository, userDto: UserService);
    registerAdmin(correo: string, nombre: string, apellidos: string, contrasena: string): Promise<Admin | void>;
    findById(id: number): Promise<UserDto>;
    getAllUsers(): Promise<UserDto[]>;
    updateUserAdmin(id: number, updateData: Partial<UpdateUserData>): Promise<AdminDto>;
    updateRole(id: number, idRol: number): Promise<UserDto>;
    deleteUser(id: number): Promise<void>;
}
