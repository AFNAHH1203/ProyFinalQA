import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarritoDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @Type(() => Number)
  usuarioId: number;

  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  @Type(() => Number)
  productoId: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Type(() => Number)
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(999, { message: 'La cantidad máxima es 999' })
  cantidad: number = 1;
}