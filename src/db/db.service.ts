/* eslint-disable prettier/prettier */

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool, createPool } from "mysql2/promise";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy{
    private pool: Pool;

    onModuleInit():void {
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            password: 'andrestorres',
            database: '451_demo',
        })
    }
    onModuleDestroy() {
       void this.pool.end();
    }

    getPool():Pool{
        return this.pool;
    }
    
}