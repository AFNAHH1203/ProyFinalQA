// src/services/productService.js
import { apiClient } from '../services/api.js';

class ProductService {
  constructor() {
    this.cacheKey = 'products_cache';
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
  }

  // ==================== GESTIÓN DE PRODUCTOS ====================

  /**
   * Obtener todos los productos
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Array>} Lista de productos
   */
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const endpoint = `/productos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint);

      // Cachear resultados
      this.setCacheData(this.cacheKey, response);

      return response;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      // Intentar devolver datos del cache en caso de error
      return this.getCacheData(this.cacheKey) || [];
    }
  }

  /**
   * Obtener productos disponibles
   * @returns {Promise<Array>} Lista de productos disponibles
   */
  async getAvailableProducts() {
    try {
      const response = await apiClient.get('/productos/disponibles');
      return response;
    } catch (error) {
      console.error('Error obteniendo productos disponibles:', error);
      return [];
    }
  }

  /**
   * Buscar productos
   * @param {Object} searchParams - Parámetros de búsqueda
   * @returns {Promise<Array>} Productos encontrados
   */
  async searchProducts(searchParams = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await apiClient.get(`/productos/search?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  }

  /**
   * Buscar producto por nombre
   * @param {string} nombre - Nombre del producto
   * @returns {Promise<Array>} Productos encontrados
   */
  async getProductByName(nombre) {
    try {
      const response = await apiClient.get(`/productos/nombre/${encodeURIComponent(nombre)}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo producto por nombre:', error);
      return [];
    }
  }

  /**
   * Obtener producto por ID
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  async getProductById(productId) {
    try {
      const response = await apiClient.get(`/productos/${productId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw new Error(error.message || 'Producto no encontrado');
    }
  }

  /**
   * Crear nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(productData) {
    try {
      // Validar datos antes de enviar
      const validation = this.validateProductData(productData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await apiClient.post('/productos', productData);
      
      // Limpiar cache para reflejar cambios
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw new Error(error.message || 'Error al crear producto');
    }
  }

  /**
   * Actualizar producto existente
   * @param {number} productId - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateProduct(productId, updateData) {
    try {
      const response = await apiClient.patch(`/productos/${productId}`, updateData);
      
      // Limpiar cache para reflejar cambios
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw new Error(error.message || 'Error al actualizar producto');
    }
  }

  /**
   * Actualizar stock de producto
   * @param {number} productId - ID del producto
   * @param {number} newStock - Nuevo stock
   * @returns {Promise<Object>} Producto actualizado
   */
  async updateStock(productId, newStock) {
    try {
      const response = await apiClient.patch(`/productos/${productId}/stock`, {
        stock: newStock
      });
      
      // Limpiar cache
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw new Error(error.message || 'Error al actualizar stock');
    }
  }

  /**
   * Eliminar producto
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteProduct(productId) {
    try {
      const response = await apiClient.delete(`/productos/${productId}`);
      
      // Limpiar cache para reflejar cambios
      this.clearCache();
      
      return response;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw new Error(error.message || 'Error al eliminar producto');
    }
  }

  // ==================== UTILIDADES Y VALIDACIÓN ====================

  /**
   * Validar datos de producto antes de enviar
   * @param {Object} productData - Datos del producto
   * @returns {Object} Resultado de la validación
   */
  validateProductData(productData) {
    const errors = [];
    const required = ['nombre', 'precio'];

    // Validar campos requeridos
    required.forEach(field => {
      if (!productData[field]) {
        errors.push(`El campo ${field} es requerido`);
      }
    });

    // Validar precio
    if (productData.precio && (isNaN(productData.precio) || productData.precio <= 0)) {
      errors.push('El precio debe ser un número mayor a 0');
    }

    // Validar stock si se proporciona
    if (productData.stock !== undefined && (isNaN(productData.stock) || productData.stock < 0)) {
      errors.push('El stock debe ser un número mayor o igual a 0');
    }

    // Validar nombre
    if (productData.nombre && productData.nombre.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formatear precio para mostrar
   * @param {number} price - Precio a formatear
   * @param {string} currency - Moneda (default: 'GTQ')
   * @returns {string} Precio formateado
   */
  formatPrice(price, currency = 'GTQ') {
    try {
      return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(price);
    } catch (error) {
      return `${currency} ${price.toFixed(2)}`;
    }
  }

  /**
   * Calcular precio con descuento
   * @param {number} originalPrice - Precio original
   * @param {number} discountPercent - Porcentaje de descuento
   * @returns {Object} Precios calculados
   */
  calculateDiscountPrice(originalPrice, discountPercent) {
    const discount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discount;
    
    return {
      original: originalPrice,
      discount: discount,
      final: finalPrice,
      savings: discount,
      percentage: discountPercent
    };
  }

  /**
   * Verificar disponibilidad de producto
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad requerida
   * @returns {Promise<Object>} Estado de disponibilidad
   */
  async checkAvailability(productId, quantity = 1) {
    try {
      const product = await this.getProductById(productId);
      
      return {
        available: product.disponible && product.stock >= quantity,
        stock: product.stock,
        requested: quantity,
        product: product
      };
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return {
        available: false,
        stock: 0,
        requested: quantity,
        product: null
      };
    }
  }

  /**
   * Generar slug para URL amigable
   * @param {string} productName - Nombre del producto
   * @returns {string} Slug generado
   */
  generateSlug(productName) {
    return productName
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  // ==================== GESTIÓN DE CACHE ====================

  /**
   * Obtener datos del cache
   * @param {string} key - Clave del cache
   * @returns {any} Datos cacheados o null
   */
  getCacheData(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Verificar si el cache ha expirado
      if (Date.now() - timestamp > this.cacheExpiry) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  /**
   * Guardar datos en cache
   * @param {string} key - Clave del cache
   * @param {any} data - Datos a cachear
   */
  setCacheData(key, data) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error guardando en cache:', error);
    }
  }

  /**
   * Limpiar cache de productos
   */
  clearCache() {
    localStorage.removeItem(this.cacheKey);
  }

  // ==================== FILTROS Y BÚSQUEDAS AVANZADAS ====================

  /**
   * Filtrar productos por criterios múltiples
   * @param {Object} filters - Filtros a aplicar
   * @returns {Promise<Array>} Productos filtrados
   */
  async filterProducts(filters = {}) {
    try {
      const searchParams = {};

      // Mapear filtros a parámetros de la API
      if (filters.nombre) searchParams.nombre = filters.nombre;
      if (filters.categoria) searchParams.categoria = filters.categoria;
      if (filters.precioMin) searchParams.precioMin = filters.precioMin;
      if (filters.precioMax) searchParams.precioMax = filters.precioMax;
      if (filters.disponible !== undefined) searchParams.disponible = filters.disponible;
      if (filters.enStock !== undefined) searchParams.enStock = filters.enStock;

      return await this.searchProducts(searchParams);
    } catch (error) {
      console.error('Error filtrando productos:', error);
      return [];
    }
  }

  /**
   * Obtener productos por rango de precio
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @returns {Promise<Array>} Productos en el rango de precio
   */
  async getProductsByPriceRange(minPrice, maxPrice) {
    try {
      return await this.searchProducts({
        precioMin: minPrice,
        precioMax: maxPrice
      });
    } catch (error) {
      console.error('Error obteniendo productos por rango de precio:', error);
      return [];
    }
  }

  /**
   * Exportar productos a CSV
   * @param {Array} products - Lista de productos
   * @returns {string} Datos CSV
   */
  exportToCSV(products) {
    if (!products || products.length === 0) {
      return '';
    }

    const headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Disponible'];
    const rows = products.map(product => [
      product.id,
      `"${product.nombre}"`,
      `"${product.descripcion || ''}"`,
      product.precio,
      product.stock || 0,
      product.disponible ? 'Sí' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  }

  /**
   * Descargar archivo CSV de productos
   * @param {Array} products - Lista de productos
   * @param {string} filename - Nombre del archivo
   */
  downloadCSV(products, filename = 'productos.csv') {
    const csvContent = this.exportToCSV(products);
    
    if (!csvContent) {
      throw new Error('No hay datos para exportar');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// Instancia única del servicio de productos
export const productService = new ProductService();