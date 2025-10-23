import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El nombre de usuario o email es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  nombreUsuario: string; // Puede ser email o nombre de usuario

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;
}