// src/config/database.ts
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/modules/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*.ts'], 
    synchronize: false, 
});
