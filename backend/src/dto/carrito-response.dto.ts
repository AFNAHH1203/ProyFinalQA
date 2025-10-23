import { Carrito } from '../entities/carrito.entity';

export class CarritoItemResponseDto {
  id: number;
  cantidad: number;
  fechaAgregado: Date;
  producto: {
    id: number;
    nombre: string;
    precio: number;
    imagenUrl?: string;
  };
  subtotal: number;
}

export class CarritoResponseDto {
  items: CarritoItemResponseDto[];
  total: number;
  cantidadItems: number;
  cantidadTotal: number; // Total de productos (suma de cantidades)
}