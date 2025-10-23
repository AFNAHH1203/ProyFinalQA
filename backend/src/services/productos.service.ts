import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm'; // ← Import faltante
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(createProductoDto);
    return await this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productosRepository.find({
      order: { fechaCreacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async findByName(nombre: string): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { nombre: nombre }
    });
    if (!producto) {
      throw new NotFoundException(`Producto "${nombre}" no encontrado`);
    }
    return producto;
  }

  async searchProducts(query: string): Promise<Producto[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return await this.productosRepository
      .createQueryBuilder('producto')
      .where('producto.nombre LIKE :query', { query: `%${query}%` })
      .orWhere('producto.descripcion LIKE :query', { query: `%${query}%` })
      .orderBy('producto.nombre', 'ASC')
      .getMany();
  }

  async getAvailableProducts(): Promise<Producto[]> {
    return await this.productosRepository.find({
      where: { stock: MoreThan(0) },
      order: { nombre: 'ASC' }
    });
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id); // Verificar que existe
    await this.productosRepository.update(id, updateProductoDto);
    return this.findOne(id);
  }

  async updateStock(id: number, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(id);
    
    if (producto.stock < cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}, solicitado: ${cantidad}`
      );
    }
    
    await this.productosRepository.update(id, { 
      stock: producto.stock - cantidad 
    });
    
    return this.findOne(id);
  }

  async increaseStock(id: number, cantidad: number): Promise<Producto> {
    const producto = await this.findOne(id);
    
    await this.productosRepository.update(id, { 
      stock: producto.stock + cantidad 
    });
    
    return this.findOne(id);
  }

  async checkStock(id: number, cantidadRequerida: number): Promise<boolean> {
    const producto = await this.findOne(id);
    return producto.stock >= cantidadRequerida;
  }

  async remove(id: number): Promise<{ message: string }> {
    const producto = await this.findOne(id); // Verificar que existe
    await this.productosRepository.delete(id);
    return { message: `Producto "${producto.nombre}" eliminado exitosamente` };
  }

  // Método para obtener productos con paginación
  async findWithPagination(page: number = 1, limit: number = 10): Promise<{
    data: Producto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [data, total] = await this.productosRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { fechaCreacion: 'DESC' }
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async fetchGoogleDriveImage(fileId: string): Promise<Buffer> {
    try {
      const imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new NotFoundException(`Imagen no encontrada en Google Drive`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      throw new NotFoundException(`Error al obtener imagen de Google Drive: ${error.message}`);
    }
  }


}