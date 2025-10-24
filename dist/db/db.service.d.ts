import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool } from "mysql2/promise";
export declare class DbService implements OnModuleInit, OnModuleDestroy {
    private pool;
    onModuleInit(): void;
    onModuleDestroy(): void;
    getPool(): Pool;
}
