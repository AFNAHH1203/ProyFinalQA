import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ProductosService } from '../services/productos.service';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get('disponibles')
  getAvailableProducts() {
    return this.productosService.getAvailableProducts();
  }

  @Get('search')
  searchProducts(@Query('q') query: string) {
    return this.productosService.searchProducts(query);
  }

  // NUEVO ENDPOINT PARA PROXY DE IMÁGENES
  @Get('imagen/:fileId')
  async proxyImage(@Param('fileId') fileId: string, @Res() res: Response): Promise<void> {
    try {
      const imageBuffer = await this.productosService.fetchGoogleDriveImage(fileId);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(imageBuffer);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send('Imagen no encontrada');
    }
  }

  @Get('nombre/:nombre')
  findByName(@Param('nombre') nombre: string) {
    return this.productosService.findByName(nombre);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Patch(':id/stock')
  updateStock(@Param('id', ParseIntPipe) id: number, @Body('cantidad') cantidad: number) {
    return this.productosService.updateStock(id, cantidad);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}