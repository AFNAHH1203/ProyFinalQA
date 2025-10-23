export interface ICarritoItem {
  id: number;
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    imagenUrl?: string;
  };
  subtotal: number;
}

export interface ICarritoCompleto {
  items: ICarritoItem[];
  resumen: {
    totalItems: number;
    cantidadTotal: number;
    subtotal: number;
    impuestos?: number;
    total: number;
  };
}