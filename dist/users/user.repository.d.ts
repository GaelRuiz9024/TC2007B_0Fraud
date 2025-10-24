import { DbService } from "src/db/db.service";
export type User = {
    id: number;
    correo: string;
    nombre: string;
    apellidos: string;
    contrasenaHash: string;
    salt: string;
    idRol: number;
};
export declare class UserRepository {
    private readonly dbService;
    constructor(dbService: DbService);
    registerUser(correo: string, nombre: string, apellidos: string, contrasena: string): Promise<User | void>;
    findByEmail(correo: string): Promise<User>;
    findById(id: number): Promise<User>;
    updateUser(id: number, updateData: Partial<User>): Promise<User>;
}
