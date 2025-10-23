import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🛒 API de Carrito de Compras con IA funcionando correctamente!';
  }

  getHealth(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Carrito de Compras API',
      version: '1.0.0',
      endpoints: {
        usuarios: '/api/usuarios',
        productos: '/api/productos',
        carrito: '/api/carrito'
      }
    };
  }

  getApiStatus(): object {
    return {
      status: 'active',
      message: 'API de Carrito de Compras con IA',
      features: [
        'CRUD de Usuarios con autenticación',
        'CRUD de Productos con gestión de stock',
        'Sistema de carrito inteligente',
        'Integración con IA para agregar productos',
        'Búsquedas flexibles',
        'Validaciones automáticas de stock'
      ],
      ai_endpoints: {
        add_to_cart: 'POST /api/carrito/ai/add',
        search_products: 'GET /api/productos/search',
        suggestions: 'GET /api/carrito/sugerencias/:usuarioId'
      }
    };
  }
}