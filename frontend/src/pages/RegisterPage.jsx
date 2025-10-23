import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import {
  PersonAdd as UserPlus,
  Email as Mail,
  Lock,
  Visibility as Eye,
  VisibilityOff as EyeOff,
  Person as User,
  Phone,
  Home,
  AccountCircle,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  AutoAwesome as Sparkles,
  ShoppingCart,
  SmartToy as Bot
} from '@mui/icons-material';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para cada campo
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = ['Información Personal', 'Cuenta', 'Datos Adicionales'];

  // Actualizar campo
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    console.log(`🔄 Campo "${field}" actualizado:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validar paso 0
  const validateStep0 = () => {
    const newErrors = {};
    
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre es requerido (mínimo 2 caracteres)';
    }
    
    if (!formData.apellido || formData.apellido.trim().length < 2) {
      newErrors.apellido = 'Apellido es requerido (mínimo 2 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar paso 1
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = 'Nombre de usuario es requerido (mínimo 3 caracteres)';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo letras, números y guiones bajos';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Contraseña es requerida (mínimo 6 caracteres)';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    console.log('▶️ handleNext llamado en paso:', activeStep);
    
    let isValid = true;
    
    if (activeStep === 0) {
      isValid = validateStep0();
    } else if (activeStep === 1) {
      isValid = validateStep1();
    }
    
    if (isValid) {
      console.log('✅ Validación exitosa, avanzando al paso:', activeStep + 1);
      setActiveStep(prev => prev + 1);
    } else {
      console.log('❌ Validación falló');
    }
  };

  // Retroceder
  const handleBack = () => {
    console.log('◀️ handleBack llamado, retrocediendo de paso:', activeStep);
    setActiveStep(prev => prev - 1);
  };

  // Crear cuenta (SOLO se llama cuando haces clic en "Crear Cuenta")
  const handleCreateAccount = async () => {
    console.log('🎯 handleCreateAccount llamado');
    console.log('📊 Datos del formulario:', formData);
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        nombreUsuario: formData.username,
        contrasena: formData.password,
        email: formData.email.toLowerCase().trim(),
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono?.trim() || null,
        direccion: formData.direccion?.trim() || null
      };
  
      console.log('📤 Datos a enviar al backend:', userData);
      
      await authService.register(userData);
      toast.success('🎉 ¡Cuenta creada exitosamente!');
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Cuenta creada. Por favor, inicia sesión.' }
        });
      }, 1000);
    } catch (error) {
      console.error('❌ Error en registro:', error);
      toast.error(error.message || 'Error al crear cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <Container maxWidth="md">
        {/* Header */}
        <Stack spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: 3
              }}
            >
              <UserPlus sx={{ fontSize: 32 }} />
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
              Crear Cuenta
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Únete a{' '}
              <Typography component="span" fontWeight="bold" color="#10b981">
                CarritoIA
              </Typography>{' '}
              y disfruta de compras inteligentes
            </Typography>
          </Box>

          {/* Features Preview */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Chip
              icon={<Bot sx={{ color: '#10b981 !important' }} />}
              label="Asistente IA"
              sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }}
            />
            <Chip
              icon={<ShoppingCart sx={{ color: '#3b82f6 !important' }} />}
              label="Carrito Inteligente"
              sx={{ bgcolor: '#dbeafe', color: '#1e40af', fontWeight: 600 }}
            />
            <Chip
              icon={<CheckCircle sx={{ color: '#10b981 !important' }} />}
              label="100% Gratis"
              sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 600 }}
            />
          </Stack>
        </Stack>

        {/* Main Card */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* NO HAY <form> tag aquí - evitamos completamente el submit del formulario */}
          <Stack spacing={3}>
            {/* Step 0: Información Personal */}
            {activeStep === 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#111827" gutterBottom>
                  Información Personal
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                      Nombre *
                    </Typography>
                    <TextField
                      value={formData.nombre}
                      onChange={handleChange('nombre')}
                      fullWidth
                      placeholder="Tu nombre"
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User sx={{ color: errors.nombre ? '#ef4444' : '#000000' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiInputBase-input': {
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.nombre ? '#ef4444' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.nombre ? '#ef4444' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.nombre ? '#ef4444' : '#3b82f6',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                      Apellido *
                    </Typography>
                    <TextField
                      value={formData.apellido}
                      onChange={handleChange('apellido')}
                      fullWidth
                      placeholder="Tu apellido"
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User sx={{ color: errors.apellido ? '#ef4444' : '#000000' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiInputBase-input': {
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: errors.apellido ? '#ef4444' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.apellido ? '#ef4444' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.apellido ? '#ef4444' : '#3b82f6',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Step 1: Cuenta */}
            {activeStep === 1 && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#111827" gutterBottom>
                  Información de Cuenta
                </Typography>

                <Box>
                  <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                    Nombre de Usuario *
                  </Typography>
                  <TextField
                    value={formData.username}
                    onChange={handleChange('username')}
                    fullWidth
                    placeholder="usuario123"
                    error={!!errors.username}
                    helperText={errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle sx={{ color: errors.username ? '#ef4444' : '#000000' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: 'white',
                        color: '#111827'
                      },
                      '& .MuiInputBase-input': {
                        color: '#111827'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: errors.username ? '#ef4444' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.username ? '#ef4444' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.username ? '#ef4444' : '#3b82f6',
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                    Email *
                  </Typography>
                  <TextField
                    value={formData.email}
                    onChange={handleChange('email')}
                    fullWidth
                    type="email"
                    placeholder="tu@email.com"
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail sx={{ color: errors.email ? '#ef4444' : '#000000' }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: 'white',
                        color: '#111827'
                      },
                      '& .MuiInputBase-input': {
                        color: '#111827'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: errors.email ? '#ef4444' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.email ? '#ef4444' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.email ? '#ef4444' : '#3b82f6',
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                    Contraseña *
                  </Typography>
                  <TextField
                    value={formData.password}
                    onChange={handleChange('password')}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: errors.password ? '#ef4444' : '#000000' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#6b7280' }}
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
                      '& .MuiInputBase-input': {
                        color: '#111827'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: errors.password ? '#ef4444' : '#d1d5db',
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
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                    Confirmar Contraseña *
                  </Typography>
                  <TextField
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: errors.confirmPassword ? '#ef4444' : '#000000' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#6b7280' }}
                          >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        bgcolor: 'white',
                        color: '#111827'
                      },
                      '& .MuiInputBase-input': {
                        color: '#111827'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: errors.confirmPassword ? '#ef4444' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.confirmPassword ? '#ef4444' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.confirmPassword ? '#ef4444' : '#3b82f6',
                        }
                      }
                    }}
                  />
                </Box>
              </>
            )}

            {/* Step 2: Datos Adicionales */}
            {activeStep === 2 && (
              <>
                <Typography variant="h6" fontWeight="bold" color="#111827" gutterBottom>
                  Datos Adicionales (Opcional)
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                      Teléfono
                    </Typography>
                    <TextField
                      value={formData.telefono}
                      onChange={handleChange('telefono')}
                      fullWidth
                      placeholder="+502 1234-5678"
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiInputBase-input': {
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                      Dirección
                    </Typography>
                    <TextField
                      value={formData.direccion}
                      onChange={handleChange('direccion')}
                      fullWidth
                      placeholder="Tu dirección"
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Home sx={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          bgcolor: 'white',
                          color: '#111827'
                        },
                        '& .MuiInputBase-input': {
                          color: '#111827'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6',
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Debug Info */}
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    ✅ Datos capturados:
                  </Typography>
                  <Typography variant="caption" display="block">
                    📞 Teléfono: "{formData.telefono || '(vacío)'}"
                  </Typography>
                  <Typography variant="caption" display="block">
                    🏠 Dirección: "{formData.direccion || '(vacío)'}"
                  </Typography>
                </Alert>
              </>
            )}

            {/* Navigation Buttons */}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                sx={{
                  color: '#6b7280',
                  borderColor: '#d1d5db',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    bgcolor: '#f9fafb'
                  }
                }}
              >
                Atrás
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleCreateAccount}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <UserPlus />}
                  endIcon={!isSubmitting && <CheckCircle />}
                  sx={{
                    bgcolor: '#10b981',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#059669' },
                    '&.Mui-disabled': { bgcolor: '#9ca3af' }
                  }}
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#3b82f6',
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  Siguiente
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Login Section */}
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="#6b7280">
                ¿Ya tienes cuenta?
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<User />}
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
              Iniciar Sesión
            </Button>
          </Box>

          {/* Terms */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 2
            }}
          >
            <Typography variant="caption" color="#6b7280" align="center" sx={{ display: 'block' }}>
              Al crear una cuenta, aceptas nuestros{' '}
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
          </Paper>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;