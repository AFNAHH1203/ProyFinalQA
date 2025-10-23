export interface IProductoCompleto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
  fechaCreacion: Date;
  disponible: boolean;
}