// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importar todos los módulos de CRUDs
import { UsuariosModule } from './modules/usuarios.module';
import { ProductosModule } from './modules/productos.module';
import { CarritoModule } from './modules/carrito.module';

// Importar entidades
import { Usuario } from './entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { Carrito } from './entities/carrito.entity';

@Module({
  imports: [
    // Configuración del entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const isDevelopment = configService.get('NODE_ENV') === 'development';
        
        return {
          type: 'mysql',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password: configService.get('DB_PASSWORD', ''),
          database: configService.get('DB_NAME', 'test'),
          entities: [
            Usuario,
            Producto,
            Carrito,
          ],
          
          // Configuración crítica para preservar datos
          synchronize: configService.get<boolean>('DB_SYNC', false),
          dropSchema: false, // NUNCA eliminar esquemas
          
          // Logging
          logging: configService.get<boolean>('DB_LOGGING', false),
          
          // Configuración básica de MySQL
          timezone: 'Z',
          charset: 'utf8mb4',
          
          // Configuración de pool de conexiones simplificada
          extra: {
            connectionLimit: 10,
            queueLimit: 0,
          },
          
          // Configuración adicional solo en desarrollo
          ...(isDevelopment && {
            cache: false, // Deshabilitar cache en desarrollo
            maxQueryExecutionTime: 1000, // Log queries lentas
          }),
        };
      },
      inject: [ConfigService],
    }),

    // Módulos de CRUDs
    UsuariosModule,
    ProductosModule,
    CarritoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}