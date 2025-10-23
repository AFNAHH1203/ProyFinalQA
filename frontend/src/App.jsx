// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Container, Paper, Typography, Button, Stack } from '@mui/material';
import { SearchOff as SearchIcon } from '@mui/icons-material';
import { useAuth } from './context/AuthContext';
import { useTheme as useCustomTheme } from './context/ThemeContext';

// Importar layout
import Layout from './components/layout/Layout';

// Importaciones de páginas
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';

// Tema claro
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Componente de carga
const LoadingSpinner = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <Stack spacing={3} alignItems="center">
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="text.secondary">
        Cargando...
      </Typography>
    </Stack>
  </Box>
);

// Componente de ruta protegida
const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = true }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no es admin
  if (requireAdmin && (!user || user.rol?.nombre !== 'Administrador')) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

// Componente de ruta pública (solo para no autenticados)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Si ya está autenticado, redirigir a productos
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

// Hook para scroll al top en cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Componente 404
const NotFoundPage = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
      p: 2,
    }}
  >
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <SearchIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
        
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" color="text.primary" gutterBottom>
          Página no encontrada
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La página que buscas no existe o ha sido movida.
        </Typography>
        
        <Stack spacing={2}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => window.history.back()}
          >
            Volver atrás
          </Button>
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => window.location.href = '/products'}
          >
            Ir a productos
          </Button>
        </Stack>
      </Paper>
    </Container>
  </Box>
);

function App() {
  const { isDarkMode } = useCustomTheme();
  const { initializeAuth, isLoading: authLoading } = useAuth();

  // Seleccionar tema basado en el modo
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Inicializar autenticación al cargar la app
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Mostrar spinner mientras se inicializa la autenticación
  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#ffffff',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <ScrollToTop />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Ruta raíz - redirige a productos */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Rutas públicas (solo para no autenticados) */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Layout showHeader={false} showFooter={false}>
                    <LoginPage />
                  </Layout>
                </PublicOnlyRoute>
              }
            />
            
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Layout showHeader={false} showFooter={false}>
                    <RegisterPage />
                  </Layout>
                </PublicOnlyRoute>
              }
            />

            {/* Rutas con layout completo */}
            <Route
              path="/*"
              element={<Layout />}
            >
              {/* Rutas públicas (accesibles para todos) */}
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductsPage />} />

              {/* Rutas protegidas (requieren autenticación) */}
              <Route
                path="cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de administrador */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="admin/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Rutas adicionales */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Navigate to="/products" replace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />

              {/* Ruta 404 - Página no encontrada */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </Box>
    </ThemeProvider>
  );
}

export default App;