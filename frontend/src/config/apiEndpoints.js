// src/config/apiEndpoints.js
import config from './env.js';

const API_BASE = config.getApiBaseUrl();

export const API_ENDPOINTS = {
  // Base
  BASE: API_BASE,
  HEALTH: `${API_BASE}/health`,
  STATUS: `${API_BASE}/api/status`,

  // Usuarios
  USERS: {
    BASE: `${API_BASE}/usuarios`,
    REGISTER: `${API_BASE}/usuarios/register`,
    LOGIN: `${API_BASE}/usuarios/login`,
    BY_ID: (id) => `${API_BASE}/usuarios/${id}`,
    UPDATE: (id) => `${API_BASE}/usuarios/${id}`,
    DELETE: (id) => `${API_BASE}/usuarios/${id}`,
  },

  // Productos
  PRODUCTS: {
    BASE: `${API_BASE}/productos`,
    AVAILABLE: `${API_BASE}/productos/disponibles`,
    SEARCH: `${API_BASE}/productos/search`,
    BY_NAME: (name) => `${API_BASE}/productos/nombre/${name}`,
    BY_ID: (id) => `${API_BASE}/productos/${id}`,
    UPDATE: (id) => `${API_BASE}/productos/${id}`,
    UPDATE_STOCK: (id) => `${API_BASE}/productos/${id}/stock`,
    DELETE: (id) => `${API_BASE}/productos/${id}`,
  },

  // Carrito
  CART: {
    BASE: `${API_BASE}/carrito`,
    ADD: `${API_BASE}/carrito/add`,
    ADD_AI: `${API_BASE}/carrito/ai/add`,
    BY_USER: (userId) => `${API_BASE}/carrito/usuario/${userId}`,
    SUMMARY: (userId) => `${API_BASE}/carrito/usuario/${userId}/resumen`,
    UPDATE: (id) => `${API_BASE}/carrito/${id}`,
    DELETE: (id) => `${API_BASE}/carrito/${id}`,
    CLEAR: (userId) => `${API_BASE}/carrito/usuario/${userId}/clear`,
  }
};

export default API_ENDPOINTS;