import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  Box,
  Container,
  Fab,
  Fade,
  Alert,
  Stack,
  Zoom
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUp,
  Wifi,
  WifiOff
} from '@mui/icons-material';
import Header from './Header';
import Footer from './footer';

const Layout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = ""
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current page needs special layout
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isFullScreenPage = ['/chat'].includes(location.pathname);

  // Auth pages get minimal layout
  if (isAuthPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f9fafb',
          transition: 'all 0.3s'
        }}
      >
        {children || <Outlet />}
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: '500px',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
              },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        minHeight: '100vh',
        bgcolor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s'
      }}
    >
      {/* Header */}
      {showHeader && <Header />}

      {/* Offline Banner */}
      {!isOnline && (
        <Fade in>
          <Alert 
            severity="error" 
            icon={<WifiOff />}
            sx={{ 
              borderRadius: 0,
              justifyContent: 'center',
              '& .MuiAlert-message': {
                textAlign: 'center'
              }
            }}
          >
            Sin conexión a internet. Algunas funciones pueden no estar disponibles.
          </Alert>
        </Fade>
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: isFullScreenPage ? 0 : 3
        }}
      >
        <Box
          sx={{
            minHeight: isFullScreenPage ? 'auto' : 'calc(100vh - 200px)',
            height: isFullScreenPage ? '100%' : 'auto'
          }}
        >
          {isFullScreenPage ? (
            <Fade in timeout={300}>
              <Box>
                {children || <Outlet />}
              </Box>
            </Fade>
          ) : (
            <Container maxWidth="xl">
              <Fade in timeout={300}>
                <Box>
                  {children || <Outlet />}
                </Box>
              </Fade>
            </Container>
          )}
        </Box>
      </Box>

      {/* Footer - Hidden on full screen pages */}
      {!isFullScreenPage && showFooter && <Footer />}

      {/* Back to Top Button */}
      <Zoom in={showBackToTop}>
        <Fab
          onClick={scrollToTop}
          size="medium"
          aria-label="Volver arriba"
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            bgcolor: 'white',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            boxShadow: 2,
            '&:hover': {
              bgcolor: '#f9fafb',
              color: '#3b82f6',
              transform: 'scale(1.1)',
              boxShadow: 4
            },
            transition: 'all 0.3s',
            zIndex: 40
          }}
        >
          <ArrowUp />
        </Fab>
      </Zoom>

      {/* Online Status Indicator */}
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 30
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 10,
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid',
              bgcolor: isOnline ? '#d1fae5' : '#fee2e2',
              color: isOnline ? '#065f46' : '#991b1b',
              borderColor: isOnline ? '#a7f3d0' : '#fecaca',
              transition: 'all 0.3s',
              boxShadow: 1
            }}
          >
            {isOnline ? (
              <>
                <Wifi sx={{ fontSize: 14 }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Conectado
                </Box>
              </>
            ) : (
              <>
                <WifiOff sx={{ fontSize: 14 }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Sin conexión
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Fade>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
          loading: {
            style: {
              background: '#3B82F6',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#3B82F6',
            },
          },
        }}
      />
    </Box>
  );
};

export default Layout;