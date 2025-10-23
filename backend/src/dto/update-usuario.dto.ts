import { IsOptional, IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'El nombre de usuario no puede exceder 50 caracteres' })
  nombreUsuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @MaxLength(150, { message: 'El email no puede exceder 150 caracteres' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede exceder 255 caracteres' })
  contrasena?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion?: string;
}