// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const { user, isAuthenticated } = useAuth();

  // Inicializar carrito cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      // Limpiar carrito cuando no hay usuario
      setCart(null);
      setCartSummary(null);
    }
  }, [isAuthenticated, user]);

  // Función para refrescar el carrito desde el servidor
  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartSummary(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [cartData, summaryData] = await Promise.all([
        cartService.getCart(user.id),
        cartService.getCartSummary(user.id)
      ]);

      setCart(cartData);
      setCartSummary(summaryData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setError('Error al cargar el carrito');
      
      // Si el error es de autenticación, no mostrar toast
      if (error.response?.status !== 401) {
        toast.error('Error al cargar el carrito');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para agregar producto al carrito (método normal)
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return { success: false, message: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      
      await cartService.addToCart({
        usuarioId: user.id,
        productoId: productId,
        cantidad: quantity
      });

      await refreshCart();
      toast.success('Producto agregado al carrito');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al agregar producto';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar producto por IA
  const addToCartByAI = async (productName, quantity = 1) => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return false;
    }

    try {
      const response = await cartService.addToCartByAI({
        usuarioId: user.id,
        productoNombre: productName,
        cantidad: quantity
      });

      if (response.success) {
        await refreshCart();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error en addToCartByAI:', error);
      return false;
    }
  };

  // Función para actualizar cantidad de un producto
  const updateQuantity = async (itemId, newQuantity) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return { success: false };
    }

    if (newQuantity < 1) {
      toast.error('La cantidad debe ser mayor a 0');
      return { success: false };
    }

    try {
      setLoading(true);
      
      await cartService.updateCartItem(itemId, newQuantity);
      await refreshCart();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar cantidad';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un producto del carrito
  const removeItem = async (itemId) => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return { success: false };
    }

    try {
      setLoading(true);
      
      await cartService.removeCartItem(itemId);
      await refreshCart();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar producto';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para vaciar el carrito
  const clearCart = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      return { success: false };
    }

    try {
      setLoading(true);
      
      await cartService.clearCart(user.id);
      await refreshCart();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al vaciar carrito';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la cantidad total de productos
  const getTotalItems = () => {
    return cartSummary?.totalItems || 0;
  };

  // Función para obtener el total de productos (suma de cantidades)
  const getTotalQuantity = () => {
    return cartSummary?.cantidadTotal || 0;
  };

  // Función para obtener el precio total
  const getTotalPrice = () => {
    return cartSummary?.total || 0;
  };

  // Función para verificar si un producto está en el carrito
  const isInCart = (productId) => {
    if (!cart || !cart.items) return false;
    return cart.items.some(item => item.producto.id === productId);
  };

  // Función para obtener la cantidad de un producto específico en el carrito
  const getProductQuantity = (productId) => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find(item => item.producto.id === productId);
    return item ? item.cantidad : 0;
  };

  // Función para obtener un producto específico del carrito
  const getCartItem = (productId) => {
    if (!cart || !cart.items) return null;
    return cart.items.find(item => item.producto.id === productId) || null;
  };

  // Función para verificar si el carrito está vacío
  const isEmpty = () => {
    return !cart || !cart.items || cart.items.length === 0;
  };

  // Función para obtener estadísticas del carrito
  const getCartStats = () => {
    if (!cart || !cart.items) {
      return {
        itemCount: 0,
        totalQuantity: 0,
        totalPrice: 0,
        averagePrice: 0,
        categories: {}
      };
    }

    const stats = {
      itemCount: cart.items.length,
      totalQuantity: cart.cantidadTotal || 0,
      totalPrice: cart.total || 0,
      averagePrice: cart.items.length > 0 ? (cart.total || 0) / cart.items.length : 0,
      categories: {}
    };

    // Agrupar por categorías (si tienes categorías en tus productos)
    cart.items.forEach(item => {
      const category = item.producto.categoria || 'Sin categoría';
      if (!stats.categories[category]) {
        stats.categories[category] = {
          count: 0,
          total: 0
        };
      }
      stats.categories[category].count += item.cantidad;
      stats.categories[category].total += item.subtotal;
    });

    return stats;
  };

  // Función para validar el carrito antes del checkout
  const validateCart = async () => {
    if (!user || isEmpty()) {
      return {
        valid: false,
        errors: ['El carrito está vacío']
      };
    }

    try {
      // Aquí podrías agregar validaciones adicionales
      // como verificar stock, precios actualizados, etc.
      
      const errors = [];
      
      // Verificar que todos los productos tengan stock
      cart.items.forEach(item => {
        if (item.cantidad > item.producto.stock) {
          errors.push(`${item.producto.nombre}: Stock insuficiente (disponible: ${item.producto.stock})`);
        }
      });

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: ['Error al validar el carrito']
      };
    }
  };

  // Función para calcular descuentos y promociones
  const calculatePromotions = () => {
    if (!cart || !cart.items) return null;

    const subtotal = cart.total || 0;
    const promotions = {
      shipping: subtotal >= 500 ? 0 : 50, // Envío gratis sobre $500
      discount: subtotal >= 1000 ? subtotal * 0.05 : 0, // 5% descuento sobre $1000
      tax: subtotal * 0.15, // 15% impuestos
    };

    promotions.finalTotal = subtotal + promotions.shipping + promotions.tax - promotions.discount;

    return promotions;
  };

  // Función para obtener productos sugeridos basados en el carrito
  const getSuggestedProducts = () => {
    // Esta función podría expandirse para llamar a un endpoint de recomendaciones
    // Por ahora retorna un array vacío
    return [];
  };

  // Función para guardar carrito temporalmente (para usuarios no autenticados)
  const saveTemporaryCart = (tempCart) => {
    try {
      localStorage.setItem('tempCart', JSON.stringify(tempCart));
    } catch (error) {
      console.error('Error al guardar carrito temporal:', error);
    }
  };

  // Función para cargar carrito temporal
  const loadTemporaryCart = () => {
    try {
      const tempCart = localStorage.getItem('tempCart');
      return tempCart ? JSON.parse(tempCart) : null;
    } catch (error) {
      console.error('Error al cargar carrito temporal:', error);
      return null;
    }
  };

  // Función para limpiar carrito temporal
  const clearTemporaryCart = () => {
    try {
      localStorage.removeItem('tempCart');
    } catch (error) {
      console.error('Error al limpiar carrito temporal:', error);
    }
  };

  // Función para migrar carrito temporal al carrito del usuario
  const migrateTemporaryCart = async () => {
    if (!user) return;

    const tempCart = loadTemporaryCart();
    if (!tempCart || !tempCart.items || tempCart.items.length === 0) return;

    try {
      setLoading(true);
      
      // Agregar cada producto del carrito temporal al carrito del usuario
      for (const item of tempCart.items) {
        await addToCart(item.producto.id, item.cantidad);
      }
      
      clearTemporaryCart();
      toast.success('Productos del carrito temporal migrados exitosamente');
    } catch (error) {
      console.error('Error al migrar carrito temporal:', error);
      toast.error('Error al migrar productos del carrito temporal');
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto que se proporcionará a los componentes
  const contextValue = {
    // Estado
    cart,
    cartSummary,
    loading,
    error,
    lastUpdate,
    
    // Funciones principales
    refreshCart,
    addToCart,
    addToCartByAI,
    updateQuantity,
    removeItem,
    clearCart,
    
    // Funciones de consulta
    getTotalItems,
    getTotalQuantity,
    getTotalPrice,
    isInCart,
    getProductQuantity,
    getCartItem,
    isEmpty,
    getCartStats,
    
    // Funciones de validación y cálculos
    validateCart,
    calculatePromotions,
    getSuggestedProducts,
    
    // Funciones para carrito temporal
    saveTemporaryCart,
    loadTemporaryCart,
    clearTemporaryCart,
    migrateTemporaryCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para manejar carrito temporal (usuarios no autenticados)
export const useTemporaryCart = () => {
  const [tempCart, setTempCart] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { migrateTemporaryCart } = useCart();

  useEffect(() => {
    // Cargar carrito temporal al montar
    const saved = localStorage.getItem('tempCart');
    if (saved) {
      setTempCart(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Migrar carrito temporal cuando el usuario se autentica
    if (isAuthenticated && user && tempCart) {
      migrateTemporaryCart();
      setTempCart(null);
    }
  }, [isAuthenticated, user, tempCart, migrateTemporaryCart]);

  const addToTempCart = (product, quantity = 1) => {
    const newTempCart = tempCart || { items: [], total: 0 };
    
    const existingItem = newTempCart.items.find(item => item.producto.id === product.id);
    
    if (existingItem) {
      existingItem.cantidad += quantity;
      existingItem.subtotal = existingItem.cantidad * product.precio;
    } else {
      newTempCart.items.push({
        id: Date.now(), // ID temporal
        producto: product,
        cantidad: quantity,
        subtotal: quantity * product.precio
      });
    }
    
    newTempCart.total = newTempCart.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    setTempCart(newTempCart);
    localStorage.setItem('tempCart', JSON.stringify(newTempCart));
    
    return { success: true };
  };

  return {
    tempCart,
    addToTempCart,
    clearTempCart: () => {
      setTempCart(null);
      localStorage.removeItem('tempCart');
    }
  };
};

export default CartContext;