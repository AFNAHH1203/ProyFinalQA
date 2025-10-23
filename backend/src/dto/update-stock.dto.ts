import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStockDto {
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Type(() => Number)
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  cantidad: number;
}