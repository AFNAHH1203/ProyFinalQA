import { IsOptional, IsString, MinLength } from 'class-validator';

export class SearchProductosDto {
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser texto' })
  @MinLength(2, { message: 'La búsqueda debe tener al menos 2 caracteres' })
  q?: string;
}