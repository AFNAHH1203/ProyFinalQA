// typeorm.config.ts - Para generar migraciones
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  
  // Entidades
  entities: ['src/entities/*.entity.ts'],
  
  // Migraciones
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  
  // Configuración
  synchronize: false, // SIEMPRE false para migraciones
  logging: true,
  timezone: 'Z',
  charset: 'utf8mb4',
});