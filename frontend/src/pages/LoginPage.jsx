import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Login as LogIn,
  Email as Mail,
  Lock,
  Visibility as Eye,
  VisibilityOff as EyeOff,
  Person as User,
  ShoppingCart,
  SmartToy as Bot,
  Warning as AlertCircle,
  CheckCircle,
  ArrowForward as ArrowRight,
  AutoAwesome as Sparkles
} from '@mui/icons-material';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const redirectMessage = location.state?.message;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (redirectMessage) {
      toast.error(redirectMessage);
    }
  }, [redirectMessage]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Llamar al authService directamente
      const response = await authService.login(data.email.toLowerCase().trim(), data.password);

      // Guardar email si remember me está marcado
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email.toLowerCase().trim());
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Actualizar el contexto con los datos del usuario
      login(response.user);

      toast.success(`¡Bienvenido de nuevo, ${response.user.nombre}!`);

      // Navegar a la ruta deseada
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (error) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      toast.error(errorMessage);

      // Limpiar campo de contraseña en caso de error
      setValue('password', '');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const fillDemoCredentials = () => {
    setValue('email', 'demo@carritoai.com');
    setValue('password', '123456');
    toast.success('Credenciales demo cargadas');
  };

  const emailValue = watch('email');
  const passwordValue = watch('password');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f9fafb',
        py: 4,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="sm">
        {/* Header */}
        <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: 3
              }}
            >
              <LogIn sx={{ fontSize: 32 }} />
            </Avatar>
            <Sparkles
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                fontSize: 20,
                color: '#fbbf24'
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" color="#111827" gutterBottom>
              Iniciar Sesión
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Accede a tu cuenta de{' '}
              <Typography component="span" fontWeight="bold" color="#3b82f6">
                CarritoIA
              </Typography>
            </Typography>
          </Box>

          {/* Features Preview */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Chip
              icon={<ShoppingCart sx={{ color: '#3b82f6 !important' }} />}
              label="Carrito Inteligente"
              sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
            />
            <Chip
              icon={<Bot sx={{ color: '#10b981 !important' }} />}
              label="Chat con IA"
              sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }}
            />
            <Chip
              icon={<User sx={{ color: '#3b82f6 !important' }} />}
              label="Perfil Personal"
              sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
            />
          </Stack>
        </Stack>

        {/* Main Card */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
          {/* Redirect Message */}
          {from !== '/' && (
            <Alert severity="info" icon={<AlertCircle />} sx={{ mb: 3 }}>
              Inicia sesión para acceder a <strong>{from}</strong>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Email Field */}
              <Box>
                <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                  Correo Electrónico
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de email inválido'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail sx={{ color: errors.email ? '#ef4444' : emailValue && !errors.email ? '#10b981' : '#9ca3af' }} />
                          </InputAdornment>
                        ),
                        endAdornment: emailValue && !errors.email && (
                          <InputAdornment position="end">
                            <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.email ? '#ef4444' : emailValue && !errors.email ? '#10b981' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.email ? '#ef4444' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.email ? '#ef4444' : '#3b82f6',
                          }
                        },
                        '& .MuiFormHelperText-root': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 1
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                  Contraseña
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: errors.password ? '#ef4444' : passwordValue && !errors.password ? '#10b981' : '#9ca3af' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{
                                color: errors.password ? '#ef4444' : passwordValue ? '#111827' : '#9ca3af',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.password ? '#ef4444' : passwordValue && !errors.password ? '#10b981' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.password ? '#ef4444' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.password ? '#ef4444' : '#3b82f6',
                          }
                        }
                      }}
                    />
                  )}
                />
              </Box>

              {/* Remember Me and Forgot Password */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ color: '#3b82f6' }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="#6b7280">
                      Recordar mi email
                    </Typography>
                  }
                />
                <Typography
                  component="a"
                  href="#"
                  sx={{
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Stack>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <LogIn />}
                endIcon={!isLoading && <ArrowRight />}
                sx={{
                  bgcolor: '#3b82f6',
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#2563eb' },
                  '&.Mui-disabled': { bgcolor: '#9ca3af', color: 'white' }
                }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

            </Stack>
          </form>

          {/* Register Section */}
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="#6b7280">
                ¿No tienes cuenta?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<User />}
              endIcon={<Sparkles />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                color: '#3b82f6',
                borderColor: '#3b82f6',
                '&:hover': {
                  borderColor: '#2563eb',
                  bgcolor: '#eff6ff'
                }
              }}
            >
              Crear cuenta nueva
            </Button>
          </Box>

          {/* Benefits */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
              ¿Por qué elegir CarritoIA?
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#dbeafe' }}>
                  <Bot sx={{ fontSize: 18, color: '#3b82f6' }} />
                </Avatar>
                <Typography variant="body2" color="#6b7280">
                  Asistente de compras con inteligencia artificial
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#dbeafe' }}>
                  <ShoppingCart sx={{ fontSize: 18, color: '#3b82f6' }} />
                </Avatar>
                <Typography variant="body2" color="#6b7280">
                  Carrito inteligente que recuerda tus preferencias
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#d1fae5' }}>
                  <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />
                </Avatar>
                <Typography variant="body2" color="#6b7280">
                  Experiencia de compra personalizada y segura
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Security Note */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 2
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#d1fae5' }}>
                <CheckCircle sx={{ color: '#10b981' }} />
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} color="#065f46">
                  Datos seguros
                </Typography>
                <Typography variant="caption" color="#059669">
                  Tu información está protegida con encriptación
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Paper>

        {/* Footer */}
        <Typography
          variant="caption"
          color="#9ca3af"
          align="center"
          sx={{ display: 'block', mt: 3 }}
        >
          Al iniciar sesión, aceptas nuestros{' '}
          <Typography
            component="a"
            href="/terms"
            sx={{
              color: '#3b82f6',
              fontSize: 'inherit',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Términos de Servicio
          </Typography>{' '}
          y{' '}
          <Typography
            component="a"
            href="/privacy"
            sx={{
              color: '#3b82f6',
              fontSize: 'inherit',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Política de Privacidad
          </Typography>
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;