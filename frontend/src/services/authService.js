// src/services/authService.js
import { apiClient } from '../services/api';

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
    this.sessionKey = 'session_id';
  }

  // ==================== AUTENTICACIÓN ====================

  /**
   * Iniciar sesión con credenciales
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario autenticado
   */
  async login(email, password) {
    try {
      console.log('Intentando login con:', { email, password: '***' }); // Para debugging
      
      const response = await apiClient.post('/usuarios/login', {
        nombreUsuario: email, // Tu backend espera nombreUsuario pero puede ser email
        contrasena: password
      });

      console.log('Respuesta del backend:', response); // Para debugging

      if (!response.usuario) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Guardar datos en localStorage
      this.saveAuthData(response.token || this.generateToken(), response.usuario);

      return {
        message: response.message || 'Login exitoso',
        user: response.usuario, // Cambié a 'user' para que coincida con tu frontend
        token: response.token || this.generateToken()
      };
    } catch (error) {
      console.error('Error en login:', error);
      
      // Mejorar el manejo de errores para mostrar el mensaje específico del backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Error al iniciar sesión');
      }
    }
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async register(userData) {
    try {
      console.log('Datos recibidos en authService:', userData); // Para debugging
      
      // Mapear correctamente los datos que vienen del frontend
      const requestData = {
        nombreUsuario: userData.nombreUsuario,
        contrasena: userData.contrasena,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        telefono: userData.telefono,
        direccion: userData.direccion
      };

      console.log('Datos enviados al backend:', requestData); // Para debugging

      const response = await apiClient.post('/usuarios/register', requestData);

      return {
        message: 'Usuario registrado exitosamente',
        usuario: response
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error al registrar usuario');
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      // Tu API no tiene endpoint de logout, solo limpiamos local
      this.clearAuthData();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.clearAuthData();
    }
  }

  // ==================== VERIFICACIÓN DE SESIÓN ====================

  /**
   * Verificar si la sesión actual es válida
   * @returns {Promise<Object|null>} Datos del usuario si la sesión es válida
   */
  async verifySession() {
    try {
      const token = this.getToken();
      const userData = this.getCurrentUser();

      if (!token || !userData) {
        return null;
      }

      // Si tienes endpoint para verificar token, úsalo aquí
      // const sessionData = await apiClient.get('/usuarios/verify-token');
      
      return userData;
    } catch (error) {
      console.error('Error verificando sesión:', error);
      this.clearAuthData();
      return null;
    }
  }

  // ==================== GESTIÓN DE USUARIOS ====================

  /**
   * Obtener todos los usuarios (solo admin)
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/usuarios');
      return response;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw new Error(error.message || 'Error al obtener usuarios');
    }
  }

  /**
   * Obtener usuario por ID
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/usuarios/${userId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw new Error(error.message || 'Usuario no encontrado');
    }
  }

  /**
   * Actualizar usuario
   * @param {number} userId - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, updateData) {
    try {
      const response = await apiClient.patch(`/usuarios/${userId}`, updateData);
      
      // Si es el usuario actual, actualizar localStorage
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.saveAuthData(this.getToken(), { ...currentUser, ...response });
      }
      
      return response;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }

  /**
   * Eliminar usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/usuarios/${userId}`);
      return response;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  }

  // ==================== UTILIDADES ====================

  /**
   * Guardar datos de autenticación
   * @param {string} token - Token de sesión
   * @param {Object} user - Datos del usuario
   */
  saveAuthData(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Obtener token actual
   * @returns {string|null} Token de autenticación
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtener usuario actual
   * @returns {Object|null} Datos del usuario
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} True si está autenticado
   */
  isAuthenticated() {
    return !!(this.getToken() && this.getCurrentUser());
  }

  /**
   * Obtener rol del usuario actual
   * @returns {string|null} Nombre del rol
   */
  getCurrentUserRole() {
    const user = this.getCurrentUser();
    return user?.rol?.nombre || user?.role || null;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} roleName - Nombre del rol a verificar
   * @returns {boolean} True si tiene el rol
   */
  hasRole(roleName) {
    const currentRole = this.getCurrentUserRole();
    return currentRole === roleName;
  }

  /**
   * Verificar si es administrador
   * @returns {boolean} True si es administrador
   */
  isAdmin() {
    return this.hasRole('admin') || this.hasRole('administrator') || this.hasRole('Administrador');
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Generar token simple para desarrollo
   * @returns {string} Token generado
   */
  generateToken() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}-${random}`);
  }

  /**
   * Inicializar autenticación
   */
  async initializeAuth() {
    try {
      const user = await this.verifySession();
      return user;
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      this.clearAuthData();
      return null;
    }
  }
}

// Instancia única del servicio de autenticación
export const authService = new AuthService();