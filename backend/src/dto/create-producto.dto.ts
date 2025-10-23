import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(1000, { message: 'La descripción no puede exceder 1000 caracteres' })
  descripcion?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'El precio no puede ser negativo' })
  @Max(999999.99, { message: 'El precio no puede exceder 999,999.99' })
  precio: number;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number = 0;

  @IsOptional()
  @IsString({ message: 'La URL de imagen debe ser texto' })
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @MaxLength(255, { message: 'La URL no puede exceder 255 caracteres' })
  imagenUrl?: string;
}