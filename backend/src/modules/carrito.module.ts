//Modulo de Carrito{}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from '../entities/carrito.entity';
import { CarritoService } from '../services/carrito.service';
import { CarritoController } from '../controllers/carrito.controller';
import { ProductosModule } from './productos.module';
import { UsuariosModule } from './usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito]),
    ProductosModule, // Para acceder a ProductosService
    UsuariosModule, 
     // Para acceder a UsuariosService
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}