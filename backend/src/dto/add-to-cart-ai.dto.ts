
import { IsNotEmpty, IsString, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartAIDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @Type(() => Number)
  usuarioId: number;

  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre del producto debe ser texto' })
  @MaxLength(100, { message: 'El nombre del producto no puede exceder 100 caracteres' })
  productoNombre: string;

  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Type(() => Number)
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(999, { message: 'La cantidad máxima es 999' })
  cantidad: number = 1;
}
