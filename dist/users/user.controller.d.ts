import { UserDto, UserService } from "./user.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
export declare class CreateUserDto {
    correo: string;
    nombre: string;
    apellidos: string;
    contrasena: string;
}
export declare class UpdateUserDto {
    correo?: string;
    nombre?: string;
    apellidos?: string;
    contrasena?: string;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerUser(userDto: CreateUserDto): Promise<UserDto | void>;
    updateUser(req: AuthenticatedRequest, updateDto: UpdateUserDto): Promise<UserDto>;
}
