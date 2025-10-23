import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsOptional } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  nombre?: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  precio?: number;

  @IsOptional()
  stock?: number;

  @IsOptional()
  imagenUrl?: string;
}
