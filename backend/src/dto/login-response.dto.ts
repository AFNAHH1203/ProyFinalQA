import { Usuario } from '../entities/usuario.entity';

export class LoginResponseDto {
  usuario: Omit<Usuario, 'password'>; // Cambiado de 'contrasena' a 'password'
  message: string;
  token?: string; // Opcional para futuro JWT
}