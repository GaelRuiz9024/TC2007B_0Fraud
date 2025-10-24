import { User, UserRepository } from "./user.repository";
export type UserDto = {
    correo: string;
    nombre: string;
    apellidos: string;
};
export interface UpdateUserData {
    correo?: string;
    nombre?: string;
    contrasena?: string;
}
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    registerUser(correo: string, nombre: string, apellidos: string, contrasena: string): Promise<UserDto | void>;
    login(correo: string, contrasena: string): Promise<User>;
    findById(id: number): Promise<User>;
    updateUser(id: number, updateData: UpdateUserData): Promise<UserDto>;
}
