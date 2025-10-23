import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCarritoDto {
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Type(() => Number)
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(999, { message: 'La cantidad máxima es 999' })
  cantidad: number;
}