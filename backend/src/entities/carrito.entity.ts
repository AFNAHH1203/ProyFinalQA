import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Producto } from './producto.entity';

@Entity('carrito')
@Unique('unique_user_product', ['usuarioId', 'productoId'])
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'producto_id' })
  productoId: number;

  @Column({ default: 1 })
  cantidad: number;

  @CreateDateColumn({ name: 'fecha_agregado' })
  fechaAgregado: Date;

  @ManyToOne(() => Usuario, usuario => usuario.carrito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Producto, producto => producto.carrito, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}