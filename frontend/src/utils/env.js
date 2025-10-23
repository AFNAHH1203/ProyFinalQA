// src/config/env.js

/**
 * Configuración centralizada de variables de entorno
 * Este archivo maneja todas las variables de entorno de la aplicación
 */

class EnvConfig {
  constructor() {
    this.environment = import.meta.env.MODE || 'development';
    this.isDevelopment = this.environment === 'development';
    this.isProduction = this.environment === 'production';
    this.isTesting = this.environment === 'test';
    
    // Validar variables críticas al inicializar
    this.validateEnvironment();
  }

  // ==================== API CONFIGURATION ====================

  /**
   * Obtener URL base de la API
   * @returns {string} URL base de la API
   */
  getApiBaseUrl() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!apiUrl) {
      console.warn('⚠️ VITE_API_BASE_URL no está configurada, usando URL por defecto');
      return this.getDefaultApiUrl();
    }
    
    // Remover slash final si existe
    return apiUrl.replace(/\/$/, '');
  }

  /**
   * Obtener URL por defecto según el entorno
   * @returns {string} URL por defecto
   */
  getDefaultApiUrl() {
    switch (this.environment) {
      case 'production':
        return 'https://api.tudominio.com/';
      case 'staging':
        return 'https://staging-api.tudominio.com/';
      case 'development':
      default:
        return 'http://localhost:3000/qa';
    }
  }

  /**
   * Obtener timeout para requests de API
   * @returns {number} Timeout en milisegundos
   */
  getApiTimeout() {
    const timeout = import.meta.env.VITE_API_TIMEOUT;
    return timeout ? parseInt(timeout) : 30000; // 30 segundos por defecto
  }

  // ==================== APP CONFIGURATION ====================

  /**
   * Obtener nombre de la aplicación
   * @returns {string} Nombre de la aplicación
   */
  getAppName() {
    return import.meta.env.VITE_APP_NAME || 'QA';
  }

  /**
   * Obtener versión de la aplicación
   * @returns {string} Versión de la aplicación
   */
  getAppVersion() {
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
  }

  /**
   * Obtener descripción de la aplicación
   * @returns {string} Descripción de la aplicación
   */
  getAppDescription() {
    return import.meta.env.VITE_APP_DESCRIPTION || 'Carrito de compras con AI';
  }

  /**
   * Obtener URL base de la aplicación
   * @returns {string} URL base
   */
  getAppUrl() {
    return import.meta.env.VITE_APP_URL || window.location.origin;
  }

  // ==================== STORAGE CONFIGURATION ====================

  /**
   * Obtener configuración de localStorage
   * @returns {Object} Configuración de storage
   */
  getStorageConfig() {
    return {
      prefix: import.meta.env.VITE_STORAGE_PREFIX || 'qa_app_',
      tokenKey: 'auth_token',
      userKey: 'auth_user',
      sessionKey: 'session_id',
      cartKey: 'shopping_cart',
      themeKey: 'theme',
      languageKey: 'language',
    };
  }

  // ==================== SECURITY CONFIGURATION ====================

  /**
   * Verificar si HTTPS está habilitado
   * @returns {boolean} True si HTTPS está habilitado
   */
  isHttpsEnabled() {
    return import.meta.env.VITE_HTTPS_ENABLED === 'true' || this.isProduction;
  }

  /**
   * Obtener configuración de CORS
   * @returns {Array} Dominios permitidos para CORS
   */
  getAllowedOrigins() {
    const origins = import.meta.env.VITE_ALLOWED_ORIGINS;
    if (origins) {
      return origins.split(',').map(origin => origin.trim());
    }
    return ['http://localhost:3000/qa', 'http://localhost:5173'];
  }

  /**
   * Obtener clave secreta para encriptación local (no sensible)
   * @returns {string} Clave para encriptación local
   */
  getLocalEncryptionKey() {
    return import.meta.env.VITE_LOCAL_ENCRYPTION_KEY || 'default_local_key_2024';
  }

  // ==================== FEATURES CONFIGURATION ====================

  /**
   * Verificar si el modo debug está habilitado
   * @returns {boolean} True si debug está habilitado
   */
  isDebugEnabled() {
    return import.meta.env.VITE_DEBUG_ENABLED === 'true' || this.isDevelopment;
  }

  /**
   * Verificar si analytics está habilitado
   * @returns {boolean} True si analytics está habilitado
   */
  isAnalyticsEnabled() {
    return import.meta.env.VITE_ANALYTICS_ENABLED === 'true' && this.isProduction;
  }

  /**
   * Obtener ID de Google Analytics
   * @returns {string|null} Google Analytics ID
   */
  getAnalyticsId() {
    return import.meta.env.VITE_ANALYTICS_ID || null;
  }

  /**
   * Verificar si el carrito de compras está habilitado
   * @returns {boolean} True si está habilitado
   */
  isCartEnabled() {
    return import.meta.env.VITE_CART_ENABLED !== 'false'; // Habilitado por defecto
  }

  /**
   * Verificar si los pagos están habilitados
   * @returns {boolean} True si están habilitados
   */
  isPaymentsEnabled() {
    return import.meta.env.VITE_PAYMENTS_ENABLED === 'true';
  }

  /**
   * Verificar si el modo mantenimiento está activo
   * @returns {boolean} True si está en mantenimiento
   */
  isMaintenanceMode() {
    return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  }

  // ==================== THIRD PARTY SERVICES ====================

  /**
   * Obtener configuración de servicios de email
   * @returns {Object} Configuración de email
   */
  getEmailConfig() {
    return {
      serviceId: import.meta.env.VITE_EMAIL_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAIL_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
    };
  }

  /**
   * Obtener configuración de mapas (Google Maps, etc.)
   * @returns {Object} Configuración de mapas
   */
  getMapsConfig() {
    return {
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      defaultLat: parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 14.6349, // Guatemala City
      defaultLng: parseFloat(import.meta.env.VITE_DEFAULT_LNG) || -90.5069,
    };
  }

  /**
   * Obtener configuración de redes sociales
   * @returns {Object} URLs de redes sociales
   */
  getSocialConfig() {
    return {
      facebook: import.meta.env.VITE_FACEBOOK_URL,
      twitter: import.meta.env.VITE_TWITTER_URL,
      instagram: import.meta.env.VITE_INSTAGRAM_URL,
      linkedin: import.meta.env.VITE_LINKEDIN_URL,
      youtube: import.meta.env.VITE_YOUTUBE_URL,
    };
  }

  // ==================== LOCALIZATION ====================

  /**
   * Obtener idioma por defecto
   * @returns {string} Código de idioma
   */
  getDefaultLanguage() {
    return import.meta.env.VITE_DEFAULT_LANGUAGE || 'es';
  }

  /**
   * Obtener idiomas soportados
   * @returns {Array} Lista de idiomas soportados
   */
  getSupportedLanguages() {
    const languages = import.meta.env.VITE_SUPPORTED_LANGUAGES;
    if (languages) {
      return languages.split(',').map(lang => lang.trim());
    }
    return ['es', 'en'];
  }

  /**
   * Obtener configuración regional
   * @returns {Object} Configuración regional
   */
  getLocaleConfig() {
    return {
      currency: import.meta.env.VITE_DEFAULT_CURRENCY || 'GTQ',
      timezone: import.meta.env.VITE_DEFAULT_TIMEZONE || 'America/Guatemala',
      dateFormat: import.meta.env.VITE_DATE_FORMAT || 'DD/MM/YYYY',
      timeFormat: import.meta.env.VITE_TIME_FORMAT || 'HH:mm',
    };
  }

  // ==================== VALIDATION & UTILITIES ====================

  /**
   * Validar que las variables críticas estén configuradas
   */
  validateEnvironment() {
    const criticalVars = [
      'VITE_API_BASE_URL'
    ];

    const missing = criticalVars.filter(varName => !import.meta.env[varName]);

    if (missing.length > 0) {
      console.warn(`⚠️ Variables de entorno faltantes: ${missing.join(', ')}`);
      
      if (this.isProduction) {
        console.error('❌ Variables críticas faltantes en producción');
      }
    }

    // Validar formato de URLs
    this.validateUrls();
  }

  /**
   * Validar formato de URLs
   */
  validateUrls() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (apiUrl && !this.isValidUrl(apiUrl)) {
      console.error(`❌ VITE_API_BASE_URL tiene formato inválido: ${apiUrl}`);
    }
  }

  /**
   * Verificar si una URL es válida
   * @param {string} url - URL a validar
   * @returns {boolean} True si es válida
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtener toda la configuración como objeto
   * @returns {Object} Configuración completa
   */
  getAllConfig() {
    return {
      environment: this.environment,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      api: {
        baseUrl: this.getApiBaseUrl(),
        timeout: this.getApiTimeout(),
      },
      app: {
        name: this.getAppName(),
        version: this.getAppVersion(),
        description: this.getAppDescription(),
        url: this.getAppUrl(),
      },
      storage: this.getStorageConfig(),
      features: {
        debug: this.isDebugEnabled(),
        analytics: this.isAnalyticsEnabled(),
        cart: this.isCartEnabled(),
        payments: this.isPaymentsEnabled(),
        maintenance: this.isMaintenanceMode(),
      },
      locale: this.getLocaleConfig(),
      social: this.getSocialConfig(),
    };
  }

  /**
   * Log de configuración para debugging
   */
  logConfig() {
    if (this.isDebugEnabled()) {
      console.group('🔧 Configuración de la aplicación');
      console.log('Entorno:', this.environment);
      console.log('API URL:', this.getApiBaseUrl());
      console.log('App Name:', this.getAppName());
      console.log('Version:', this.getAppVersion());
      console.log('Debug:', this.isDebugEnabled());
      console.log('Analytics:', this.isAnalyticsEnabled());
      console.groupEnd();
    }
  }
}

// Crear instancia única de configuración
const config = new EnvConfig();

// Log de configuración en desarrollo
if (config.isDevelopment) {
  config.logConfig();
}

export default config;