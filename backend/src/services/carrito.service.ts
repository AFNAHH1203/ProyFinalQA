// src/services/carrito.service.ts - VERSIÓN CORREGIDA
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Carrito } from '../entities/carrito.entity';
import { CreateCarritoDto } from '../dto/create-carrito.dto';
import { UpdateCarritoDto } from '../dto/update-carrito.dto';
import { AddToCartAIDto } from '../dto/add-to-cart-ai.dto';
import { CarritoResponseDto, CarritoItemResponseDto } from '../dto/carrito-response.dto';
import { CarritoSummaryDto } from '../dto/carrito-summary.dto';
import { AIResponseDto } from '../dto/ai-response.dto';
import { ProductosService } from './productos.service';
import { UsuariosService } from './usuarios.service';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    private productosService: ProductosService,
    private usuariosService: UsuariosService,
  ) {}

  async addItem(createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    // Verificar que usuario y producto existan
    await this.usuariosService.findOne(createCarritoDto.usuarioId);
    const producto = await this.productosService.findOne(createCarritoDto.productoId);

    // Verificar stock
    if (producto.stock < createCarritoDto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${createCarritoDto.cantidad}`
      );
    }

    // Verificar si ya existe en carrito
    const existingItem = await this.carritoRepository.findOne({
      where: {
        usuarioId: createCarritoDto.usuarioId,
        productoId: createCarritoDto.productoId
      },
      relations: ['producto']
    });

    if (existingItem) {
      // Actualizar cantidad
      const nuevaCantidad = existingItem.cantidad + createCarritoDto.cantidad;
      
      if (producto.stock < nuevaCantidad) {
        throw new BadRequestException(
          `Stock insuficiente para la cantidad total. Disponible: ${producto.stock}, en carrito: ${existingItem.cantidad}, solicitado: ${createCarritoDto.cantidad}`
        );
      }
      
      return await this.updateItem(existingItem.id, { cantidad: nuevaCantidad });
    } else {
      // Crear nuevo item
      const carritoItem = this.carritoRepository.create(createCarritoDto);
      return await this.carritoRepository.save(carritoItem);
    }
  }

  async addItemByAI(addToCartAIDto: AddToCartAIDto): Promise<AIResponseDto> {
    try {
      // Verificar usuario
      await this.usuariosService.findOne(addToCartAIDto.usuarioId);

      // Buscar producto por nombre (con búsqueda flexible para IA)
      let producto;
      try {
        // Intentar búsqueda exacta primero
        producto = await this.productosService.findByName(addToCartAIDto.productoNombre);
      } catch (error) {
        // Si no encuentra exacto, buscar por similitud
        const productos = await this.productosService.searchProducts(addToCartAIDto.productoNombre);
        
        if (productos.length === 0) {
          const productosDisponibles = await this.productosService.getAvailableProducts();
          return {
            success: false,
            message: `No se encontró ningún producto con el nombre "${addToCartAIDto.productoNombre}". Productos disponibles: ${productosDisponibles.map(p => p.nombre).join(', ')}`,
            error: 'PRODUCTO_NO_ENCONTRADO'
          };
        }
        
        if (productos.length > 1) {
          return {
            success: false,
            message: `Se encontraron múltiples productos similares: ${productos.map(p => p.nombre).join(', ')}. Por favor, especifica el nombre exacto.`,
            error: 'MULTIPLES_PRODUCTOS',
            data: productos.map(p => ({ id: p.id, nombre: p.nombre }))
          };
        }
        
        producto = productos[0];
      }

      const carritoDto: CreateCarritoDto = {
        usuarioId: addToCartAIDto.usuarioId,
        productoId: producto.id,
        cantidad: addToCartAIDto.cantidad
      };

      const item = await this.addItem(carritoDto);
      
      return {
        success: true,
        message: `✅ "${producto.nombre}" agregado al carrito exitosamente (Cantidad: ${addToCartAIDto.cantidad}, Precio: $${producto.precio})`,
        data: {
          item,
          producto: {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio
          }
        }
      };

    } catch (error: any) {
      return {
        success: false,
        message: `❌ Error al agregar producto: ${error.message}`,
        error: error.message
      };
    }
  }

  async getCarritoByUser(usuarioId: number): Promise<CarritoResponseDto> {
    // Verificar que el usuario exista
    await this.usuariosService.findOne(usuarioId);

    const carrito = await this.carritoRepository
      .createQueryBuilder('carrito')
      .leftJoinAndSelect('carrito.producto', 'producto')
      .where('carrito.usuarioId = :usuarioId', { usuarioId })
      .orderBy('carrito.fechaAgregado', 'DESC')
      .getMany();

    const items: CarritoItemResponseDto[] = carrito.map(item => ({
      id: item.id,
      cantidad: item.cantidad,
      fechaAgregado: item.fechaAgregado,
      producto: {
        id: item.producto.id,
        nombre: item.producto.nombre,
        precio: Number(item.producto.precio),
        imagenUrl: item.producto.imagenUrl || undefined
      },
      subtotal: Number((Number(item.producto.precio) * item.cantidad).toFixed(2))
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

    return {
      items,
      total: Number(total.toFixed(2)),
      cantidadItems: items.length,
      cantidadTotal
    };
  }

  async updateItem(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito> {
    const item = await this.carritoRepository.findOne({
      where: { id },
      relations: ['producto']
    });

    if (!item) {
      throw new NotFoundException(`Item del carrito con ID ${id} no encontrado`);
    }

    // Verificar stock
    if (item.producto.stock < updateCarritoDto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${item.producto.stock}, solicitado: ${updateCarritoDto.cantidad}`
      );
    }

    await this.carritoRepository.update(id, updateCarritoDto);
    
    const updatedItem = await this.carritoRepository.findOne({
      where: { id },
      relations: ['producto']
    });

    if (!updatedItem) {
      throw new NotFoundException(`Item del carrito con ID ${id} no encontrado después de la actualización`);
    }

    return updatedItem;
  }

  async removeItem(id: number): Promise<{ message: string }> {
    const item = await this.carritoRepository.findOne({
      where: { id },
      relations: ['producto']
    });

    if (!item) {
      throw new NotFoundException(`Item del carrito con ID ${id} no encontrado`);
    }

    const result: DeleteResult = await this.carritoRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`No se pudo eliminar el item con ID ${id}`);
    }

    return { 
      message: `"${item.producto.nombre}" eliminado del carrito exitosamente` 
    };
  }

  async clearCarrito(usuarioId: number): Promise<{ message: string }> {
    // Verificar que el usuario exista
    await this.usuariosService.findOne(usuarioId);

    const result: DeleteResult = await this.carritoRepository.delete({ usuarioId });
    
    return { 
      message: result.affected && result.affected > 0
        ? `Carrito vaciado exitosamente (${result.affected} items eliminados)` 
        : 'El carrito ya estaba vacío'
    };
  }

  async getCarritoSummary(usuarioId: number): Promise<CarritoSummaryDto> {
    // Verificar que el usuario exista
    await this.usuariosService.findOne(usuarioId);

    const result = await this.carritoRepository
      .createQueryBuilder('carrito')
      .select([
        'COUNT(carrito.id) as totalItems',
        'SUM(carrito.cantidad) as cantidadTotal',
        'SUM(carrito.cantidad * producto.precio) as total'
      ])
      .leftJoin('carrito.producto', 'producto')
      .where('carrito.usuarioId = :usuarioId', { usuarioId })
      .getRawOne();

    return {
      totalItems: parseInt(result?.totalItems || '0'),
      cantidadTotal: parseInt(result?.cantidadTotal || '0'),
      total: parseFloat(result?.total || '0')
    };
  }

  // Método para obtener productos sugeridos basados en el carrito
  async getSugerenciasIA(usuarioId: number): Promise<{ message: string; productos: string[] }> {
    const carrito = await this.getCarritoByUser(usuarioId);
    const productosDisponibles = await this.productosService.getAvailableProducts();
    
    const productosEnCarrito = carrito.items.map(item => item.producto.nombre);
    const productosSugeridos = productosDisponibles
      .filter(p => !productosEnCarrito.includes(p.nombre))
      .map(p => p.nombre);

    return {
      message: carrito.items.length > 0 
        ? "Basándome en tu carrito, podrías estar interesado en estos productos:" 
        : "Tu carrito está vacío. Aquí tienes algunos productos disponibles:",
      productos: productosSugeridos
    };
  }

  // Método para validar todo el carrito antes de checkout
  async validarCarrito(usuarioId: number): Promise<{
    valido: boolean;
    errores: string[];
    carrito: CarritoResponseDto;
  }> {
    const carrito = await this.getCarritoByUser(usuarioId);
    const errores: string[] = [];

    for (const item of carrito.items) {
      const producto = await this.productosService.findOne(item.producto.id);
      
      if (producto.stock < item.cantidad) {
        errores.push(
          `${producto.nombre}: Stock insuficiente (disponible: ${producto.stock}, en carrito: ${item.cantidad})`
        );
      }
    }

    return {
      valido: errores.length === 0,
      errores,
      carrito
    };
  }

  // Método adicional para buscar un item específico en el carrito
  async findCarritoItem(usuarioId: number, productoId: number): Promise<Carrito | null> {
    return await this.carritoRepository.findOne({
      where: {
        usuarioId,
        productoId
      },
      relations: ['producto', 'usuario']
    });
  }

  // Método para obtener el total de items en el carrito (para badges/notificaciones)
  async getItemCount(usuarioId: number): Promise<number> {
    const count = await this.carritoRepository.count({
      where: { usuarioId }
    });
    return count;
  }
}