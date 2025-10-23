import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CarritoService } from '../services/carrito.service';
import { CreateCarritoDto } from '../dto/create-carrito.dto';
import { UpdateCarritoDto } from '../dto/update-carrito.dto';
import { AddToCartAIDto } from '../dto/add-to-cart-ai.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  // Endpoint normal para agregar al carrito
  @Post('add')
  addItem(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.addItem(createCarritoDto);
  }

  // Endpoint especial para IA - agregar por nombre de producto
  @Post('ai/add')
  addItemByAI(@Body() addToCartAIDto: AddToCartAIDto) {
    return this.carritoService.addItemByAI(addToCartAIDto);
  }

  // Ver carrito completo de un usuario
  @Get('usuario/:usuarioId')
  getCarritoByUser(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.getCarritoByUser(usuarioId);
  }

  // Resumen del carrito (para mostrar en header/navbar)
  @Get('usuario/:usuarioId/resumen')
  getCarritoSummary(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.getCarritoSummary(usuarioId);
  }

  // Actualizar cantidad de un item
  @Patch(':id')
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritoService.updateItem(id, updateCarritoDto);
  }

  // Eliminar item del carrito
  @Delete(':id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.removeItem(id);
  }

  // Vaciar carrito completo
  @Delete('usuario/:usuarioId/clear')
  clearCarrito(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.carritoService.clearCarrito(usuarioId);
  }
}