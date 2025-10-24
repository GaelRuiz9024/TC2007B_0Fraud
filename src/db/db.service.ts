
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool, createPool } from "mysql2/promise";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy{
    private pool: Pool;

    onModuleInit():void {
        this.pool = createPool({
           host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'ciberseguridaddb',
        })
    }
    onModuleDestroy() {
       void this.pool.end();
    }

    getPool():Pool{
        return this.pool;
    }
    
}
