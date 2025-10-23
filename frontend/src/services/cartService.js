// src/services/cartService.js
import { apiClient } from '../services/api';

// Función para obtener el carrito completo del usuario
const getCart = async (userId) => {
  try {
    console.log('Obteniendo carrito para usuario:', userId);
    return await apiClient.get(`/carrito/usuario/${userId}`);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    throw error;
  }
};

// Función para obtener el resumen del carrito
const getCartSummary = async (userId) => {
  try {
    console.log('Obteniendo resumen del carrito para usuario:', userId);
    return await apiClient.get(`/carrito/usuario/${userId}/resumen`);
  } catch (error) {
    console.error('Error al obtener resumen del carrito:', error);
    // Si no existe endpoint de resumen, calcular desde el carrito completo
    try {
      const cartData = await getCart(userId);
      return {
        totalItems: cartData.items?.length || 0,
        cantidadTotal: cartData.cantidadTotal || 0,
        total: cartData.total || 0
      };
    } catch (cartError) {
      // Si tampoco puede obtener el carrito, retornar valores por defecto
      return {
        totalItems: 0,
        cantidadTotal: 0,
        total: 0
      };
    }
  }
};

// Función para agregar producto al carrito (método normal)
const addToCart = async ({ usuarioId, productoId, cantidad }) => {
  try {
    console.log('Agregando al carrito:', { usuarioId, productoId, cantidad });
    return await apiClient.post('/carrito/add', {
      usuarioId,
      productoId,
      cantidad
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    throw error;
  }
};

// Función para agregar producto por IA (búsqueda por nombre)
const addToCartByAI = async ({ usuarioId, productoNombre, cantidad }) => {
  try {
    console.log('Agregando al carrito por IA:', { usuarioId, productoNombre, cantidad });
    const data = await apiClient.post('/carrito/ai/add', {
      usuarioId,
      productoNombre,
      cantidad
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error al agregar al carrito por IA:', error);
    return { success: false, error: error.message };
  }
};

// Función para actualizar cantidad de un item del carrito
const updateCartItem = async (itemId, cantidad) => {
  try {
    console.log('Actualizando item del carrito:', { itemId, cantidad });
    return await apiClient.patch(`/carrito/${itemId}`, { cantidad });
  } catch (error) {
    console.error('Error al actualizar item del carrito:', error);
    throw error;
  }
};

// Función para eliminar un item del carrito
const removeCartItem = async (itemId) => {
  try {
    console.log('Eliminando item del carrito:', itemId);
    return await apiClient.delete(`/carrito/${itemId}`);
  } catch (error) {
    console.error('Error al eliminar item del carrito:', error);
    throw error;
  }
};

// Función para vaciar el carrito completo
const clearCart = async (userId) => {
  try {
    console.log('Vaciando carrito para usuario:', userId);
    return await apiClient.delete(`/carrito/usuario/${userId}/clear`);
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    throw error;
  }
};

// Función para validar stock antes del checkout (si tienes este endpoint)
const validateCartStock = async (userId) => {
  try {
    return await apiClient.get(`/carrito/usuario/${userId}/validate`);
  } catch (error) {
    console.error('Error al validar stock del carrito:', error);
    throw error;
  }
};

// Función para procesar checkout (si tienes este endpoint)
const processCheckout = async (userId, checkoutData) => {
  try {
    return await apiClient.post(`/carrito/usuario/${userId}/checkout`, checkoutData);
  } catch (error) {
    console.error('Error al procesar checkout:', error);
    throw error;
  }
};

// Función para obtener historial de carritos/órdenes (si tienes este endpoint)
const getCartHistory = async (userId, page = 1, limit = 10) => {
  try {
    return await apiClient.get(`/carrito/usuario/${userId}/history?page=${page}&limit=${limit}`);
  } catch (error) {
    console.error('Error al obtener historial del carrito:', error);
    throw error;
  }
};

// Función para aplicar cupón de descuento (si tienes este endpoint)
const applyCoupon = async (userId, couponCode) => {
  try {
    return await apiClient.post(`/carrito/usuario/${userId}/coupon`, { couponCode });
  } catch (error) {
    console.error('Error al aplicar cupón:', error);
    throw error;
  }
};

// Función para remover cupón de descuento (si tienes este endpoint)
const removeCoupon = async (userId) => {
  try {
    return await apiClient.delete(`/carrito/usuario/${userId}/coupon`);
  } catch (error) {
    console.error('Error al remover cupón:', error);
    throw error;
  }
};

// Función para calcular costos de envío (si tienes este endpoint)
const calculateShipping = async (userId, shippingData) => {
  try {
    return await apiClient.post(`/carrito/usuario/${userId}/shipping`, shippingData);
  } catch (error) {
    console.error('Error al calcular envío:', error);
    throw error;
  }
};

// Exportar todas las funciones
export const cartService = {
  // Funciones principales
  getCart,
  getCartSummary,
  addToCart,
  addToCartByAI,
  updateCartItem,
  removeCartItem,
  clearCart,
  
  // Funciones adicionales (opcionales)
  validateCartStock,
  processCheckout,
  getCartHistory,
  applyCoupon,
  removeCoupon,
  calculateShipping
};

export default cartService;