import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuariosService } from '../services/usuarios.service';
import { UsuariosController } from '../controllers/usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Para usar en otros módulos
})
export class UsuariosModule {}