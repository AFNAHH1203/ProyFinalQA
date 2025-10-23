// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessionId: null,
};

// Tipos de acciones
const AuthActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_ERROR: 'AUTH_ERROR',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_CLEAR_ERROR: 'AUTH_CLEAR_ERROR',
  AUTH_UPDATE_USER: 'AUTH_UPDATE_USER',
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AuthActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionId: action.payload.sessionId,
      };

    case AuthActionTypes.AUTH_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionId: null,
      };

    case AuthActionTypes.AUTH_LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AuthActionTypes.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AuthActionTypes.AUTH_UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar autenticación (verificar sesión existente)
  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });
      
      const user = await authService.verifySession();
      
      if (user) {
        dispatch({
          type: AuthActionTypes.AUTH_SUCCESS,
          payload: {
            user,
            sessionId: localStorage.getItem('session_id'),
          },
        });
      } else {
        dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: 'Error al verificar sesión',
      });
    }
  }, []);

  // Función para hacer login - CORREGIDA
  const login = useCallback((userData) => {
    try {
      // El authService ya maneja el login, solo necesitamos actualizar el estado
      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: {
          user: userData,
          sessionId: authService.getToken(),
        },
      });

      return userData;
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: errorMessage,
      });

      throw error;
    }
  }, []);

  // Función para registrarse
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });
      
      const response = await authService.register(userData);
      
      toast.success('Usuario registrado exitosamente. Por favor, inicia sesión.');
      
      dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Error al registrar usuario';
      
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: errorMessage,
      });

      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Función para hacer logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar logout local aunque falle el backend
      dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
      toast.success('Sesión cerrada');
    }
  }, []);

  // Función para actualizar datos del usuario
  const updateUser = useCallback(async (updateData) => {
    try {
      dispatch({
        type: AuthActionTypes.AUTH_UPDATE_USER,
        payload: updateData,
      });

      toast.success('Perfil actualizado exitosamente');
      
      return state.user;
    } catch (error) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      toast.error(errorMessage);
      throw error;
    }
  }, [state.user]);

  // Función para cambiar contraseña
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Contraseña cambiada exitosamente');
    } catch (error) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: AuthActionTypes.AUTH_CLEAR_ERROR });
  }, []);

  // Función para verificar permisos
  const hasPermission = useCallback((permission) => {
    if (!state.user || !state.user.rol) return false;
    
    const userRole = state.user.rol.nombre;
    
    switch (permission) {
      case 'admin':
        return userRole === 'Administrador';
      case 'teacher':
        return userRole === 'Profesor' || userRole === 'Administrador';
      case 'student':
        return userRole === 'Estudiante' || userRole === 'Profesor' || userRole === 'Administrador';
      default:
        return false;
    }
  }, [state.user]);

  // Función para verificar si es administrador
  const isAdmin = useCallback(() => {
    return hasPermission('admin');
  }, [hasPermission]);

  // Función para verificar si es profesor
  const isTeacher = useCallback(() => {
    return hasPermission('teacher');
  }, [hasPermission]);

  // Función para obtener información del usuario
  const getUserInfo = useCallback(() => {
    return state.user;
  }, [state.user]);

  // Verificar sesión periódicamente (cada 5 minutos)
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(async () => {
        try {
          const user = await authService.verifySession();
          if (!user) {
            dispatch({ type: AuthActionTypes.AUTH_LOGOUT });
            toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          }
        } catch (error) {
          console.error('Error verificando sesión:', error);
        }
      }, 5 * 60 * 1000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  // Manejar cierre de ventana/pestaña
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (state.isAuthenticated) {
        // Opcional: Mostrar confirmación antes de cerrar
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.isAuthenticated]);

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    sessionId: state.sessionId,

    // Acciones
    initializeAuth,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    clearError,

    // Utilidades
    hasPermission,
    isAdmin,
    isTeacher,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};