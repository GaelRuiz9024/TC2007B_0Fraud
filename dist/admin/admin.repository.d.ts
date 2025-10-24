import { DbService } from "src/db/db.service";
import { UserRepository, User } from "src/users/user.repository";
export type Admin = {
    id: number;
    correo: string;
    nombre: string;
    apellidos: string;
    contrasenaHash: string;
    salt: string;
};
export declare class AdminRepository {
    private readonly dbService;
    private readonly userRepo;
    constructor(dbService: DbService, userRepo: UserRepository);
    registerAdmin(correo: string, nombre: string, apellidos: string, contrasena: string): Promise<Admin | void>;
    updateUserAdmin(id: number, updateData: Partial<User>): Promise<User>;
    getAllUsers(): Promise<User[]>;
    deleteUser(id: number): Promise<void>;
    findById(id: number): Promise<User>;
}
