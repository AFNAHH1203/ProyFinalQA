import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Carrito } from './carrito.entity'; // Asegúrate de que la ruta sea correcta

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  nombreUsuario: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true, length: 20 })
  telefono: string;

  @Column({ nullable: true, length: 255 })
  direccion: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_registro' })
  fechaRegistro: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Relación con Carrito - Un usuario puede tener muchos carritos
  @OneToMany(() => Carrito, carrito => carrito.usuario, { 
    cascade: true,
    onDelete: 'CASCADE' 
  })
  carrito: Carrito[];
}