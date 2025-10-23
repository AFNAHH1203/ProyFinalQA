import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    // Verificar si el email ya existe
    const existingUserByEmail = await this.usuariosRepository.findOne({
      where: { email: createUsuarioDto.email.toLowerCase() }
    });

    if (existingUserByEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUserByUsername = await this.usuariosRepository.findOne({
      where: { nombreUsuario: createUsuarioDto.nombreUsuario }
    });

    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, saltRounds);
    
    // Crear usuario con todos los campos mapeados correctamente
    const usuario = this.usuariosRepository.create({
      nombreUsuario: createUsuarioDto.nombreUsuario,
      nombre: createUsuarioDto.nombre,
      apellido: createUsuarioDto.apellido,
      email: createUsuarioDto.email.toLowerCase(),
      password: hashedPassword,
      telefono: createUsuarioDto.telefono,
      direccion: createUsuarioDto.direccion,
    });

    const savedUser = await this.usuariosRepository.save(usuario);
    
    // Excluir la contraseña antes de devolver
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Buscar por email o nombreUsuario
    const usuario = await this.usuariosRepository.findOne({
      where: [
        { email: loginDto.nombreUsuario.toLowerCase() },
        { nombreUsuario: loginDto.nombreUsuario }
      ]
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.contrasena, usuario.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const { password, ...usuarioSinPassword } = usuario;
    
    return { 
      usuario: usuarioSinPassword,
      message: 'Login exitoso'
    };
  }

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    const usuarios = await this.usuariosRepository.find({
      order: { fechaRegistro: 'DESC' }
    });
    
    return usuarios.map(usuario => {
      const { password, ...userWithoutPassword } = usuario;
      return userWithoutPassword;
    });
  }

  async findOne(id: number): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    const { password, ...userWithoutPassword } = usuario;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: { email: email.toLowerCase() }
    });
  }

  async findByUsername(nombreUsuario: string): Promise<Usuario | null> {
    return await this.usuariosRepository.findOne({
      where: { nombreUsuario }
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar email único si se está actualizando
    if (updateUsuarioDto.email && updateUsuarioDto.email.toLowerCase() !== usuario.email) {
      const existingUser = await this.findByEmail(updateUsuarioDto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Verificar nombreUsuario único si se está actualizando
    if (updateUsuarioDto.nombreUsuario && updateUsuarioDto.nombreUsuario !== usuario.nombreUsuario) {
      const existingUser = await this.findByUsername(updateUsuarioDto.nombreUsuario);
      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    // Preparar payload de actualización
    const updatePayload: Partial<Usuario> = {};
    
    if (updateUsuarioDto.nombreUsuario) {
      updatePayload.nombreUsuario = updateUsuarioDto.nombreUsuario;
    }
    
    if (updateUsuarioDto.nombre) {
      updatePayload.nombre = updateUsuarioDto.nombre;
    }
    
    if (updateUsuarioDto.apellido) {
      updatePayload.apellido = updateUsuarioDto.apellido;
    }
    
    if (updateUsuarioDto.email) {
      updatePayload.email = updateUsuarioDto.email.toLowerCase();
    }
    
    if (updateUsuarioDto.telefono !== undefined) {
      updatePayload.telefono = updateUsuarioDto.telefono;
    }
    
    if (updateUsuarioDto.direccion !== undefined) {
      updatePayload.direccion = updateUsuarioDto.direccion;
    }

    if (updateUsuarioDto.contrasena) {
      const hashedPassword = await bcrypt.hash(updateUsuarioDto.contrasena, 10);
      updatePayload.password = hashedPassword;
    }

    await this.usuariosRepository.update(id, updatePayload);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usuariosRepository.delete(id);
    return { message: `Usuario "${usuario.nombre} ${usuario.apellido}" eliminado exitosamente` };
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const usuario = await this.usuariosRepository.findOne({ where: { id } });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
    
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await this.usuariosRepository.update(id, { password: hashedNewPassword });
    
    return { message: 'Contraseña actualizada exitosamente' };
  }

  async getUserStats(id: number): Promise<{
    usuario: Omit<Usuario, 'password'>;
    estadisticas: {
      fechaRegistro: Date;
      diasRegistrado: number;
    };
  }> {
    const usuario = await this.findOne(id);
    const now = new Date();
    const fechaRegistro = new Date(usuario.fechaRegistro);
    const diasRegistrado = Math.floor((now.getTime() - fechaRegistro.getTime()) / (1000 * 60 * 60 * 24));

    return {
      usuario,
      estadisticas: {
        fechaRegistro,
        diasRegistrado
      }
    };
  }
}