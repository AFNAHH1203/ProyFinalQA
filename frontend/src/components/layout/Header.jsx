import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Typography,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  Paper,
  Chip,
  ListItemButton
} from '@mui/material';
import {
  ShoppingCart,
  Person as User,
  Logout as LogOut,
  SmartToy as Bot,
  Menu as MenuIcon,
  Close as X,
  Search,
  Notifications as Bell,
  Settings,
  Inventory as Package,
  Favorite as Heart,
  ExpandMore as ChevronDown,
  AutoAwesome as Sparkles,
  Security as Shield,
  Home,
  BarChart as BarChart3
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3);
  
  const { user, logout } = useAuth();
  const { cartSummary } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isUserMenuOpen = Boolean(userMenuAnchor);

  useEffect(() => {
    setIsMenuOpen(false);
    setUserMenuAnchor(null);
  }, [location]);

  const handleLogout = () => {
    logout();
    setUserMenuAnchor(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    {
      label: 'Inicio',
      href: '/',
      icon: Home,
      active: location.pathname === '/'
    },
    {
      label: 'Chat IA',
      href: '/chat',
      icon: Bot,
      active: location.pathname === '/chat',
      badge: 'IA',
      highlight: true
    },
    {
      label: 'Productos',
      href: '/',
      icon: Package,
      active: location.pathname === '/' || location.pathname === '/products'
    }
  ];

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      href: '/profile',
      icon: User,
      description: 'Información personal'
    },
    {
      label: 'Mis Pedidos',
      href: '/orders',
      icon: Package,
      description: 'Historial de compras'
    },
    {
      label: 'Favoritos',
      href: '/favorites',
      icon: Heart,
      description: 'Productos guardados'
    },
    {
      label: 'Configuración',
      href: '/settings',
      icon: Settings,
      description: 'Preferencias de cuenta'
    }
  ];

  if (user?.rol?.nombre === 'Administrador') {
    userMenuItems.push({
      label: 'Administración',
      href: '/admin',
      icon: BarChart3,
      description: 'Panel de control',
      admin: true
    });
  }

  return (
    <AppBar 
      position="sticky" 
      elevation={2}
      sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        color: '#111827'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 70 } }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 2, md: 4 } }}>
            <Button
              component={Link}
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                textTransform: 'none',
                color: 'inherit',
                '&:hover': { bgcolor: 'transparent' }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    width: 40,
                    height: 40,
                    boxShadow: 2
                  }}
                >
                  <Bot />
                </Avatar>
                <Sparkles
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 14,
                    color: '#fbbf24'
                  }}
                />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  CarritoIA
                </Typography>
                <Typography variant="caption" color="#9ca3af" sx={{ display: 'block', mt: -0.5 }}>
                  Compras Inteligentes
                </Typography>
              </Box>
            </Button>
          </Box>

          {/* Search Bar - Desktop */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flexGrow: 1, 
              maxWidth: 500,
              mx: 4
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar productos o usar Chat IA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#f9fafb',
                  borderRadius: 2,
                  color: '#111827',
                  '&:hover': {
                    bgcolor: 'white'
                  }
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    '& fieldset': {
                      borderColor: '#3b82f6',
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      type="submit" 
                      size="small"
                      sx={{ 
                        bgcolor: '#3b82f6',
                        color: 'white',
                        '&:hover': { bgcolor: '#2563eb' },
                        width: 32,
                        height: 32
                      }}
                    >
                      <Search sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ display: { xs: 'none', lg: 'flex' }, mr: 2 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                to={item.href}
                startIcon={<item.icon />}
                sx={{
                  color: item.active ? '#3b82f6' : '#374151',
                  bgcolor: item.active ? '#eff6ff' : 'transparent',
                  border: item.highlight ? '1px solid #bfdbfe' : 'none',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    bgcolor: item.active ? '#dbeafe' : '#f3f4f6',
                    color: '#3b82f6'
                  }
                }}
              >
                {item.label}
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white'
                    }}
                  />
                )}
                {item.highlight && (
                  <Sparkles sx={{ ml: 0.5, fontSize: 16, color: '#3b82f6' }} />
                )}
              </Button>
            ))}
          </Stack>

          {/* User Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Mobile Search */}
            <IconButton 
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: '#6b7280',
                '&:hover': { color: '#3b82f6', bgcolor: '#f3f4f6' }
              }}
            >
              <Search />
            </IconButton>

            {user ? (
              <>
                {/* Notifications */}
                <IconButton
                  sx={{
                    color: '#6b7280',
                    '&:hover': { color: '#3b82f6', bgcolor: '#f3f4f6' }
                  }}
                >
                  <Badge 
                    badgeContent={notifications} 
                    color="error"
                    max={9}
                  >
                    <Bell />
                  </Badge>
                </IconButton>

                {/* Cart */}
                <IconButton
                  component={Link}
                  to="/cart"
                  sx={{
                    color: '#6b7280',
                    '&:hover': { color: '#3b82f6', bgcolor: '#f3f4f6' }
                  }}
                >
                  <Badge 
                    badgeContent={cartSummary?.totalItems || 0} 
                    color="primary"
                    max={9}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* User Menu */}
                <Button
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: '#374151',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#f3f4f6' }
                  }}
                  endIcon={
                    <ChevronDown 
                      sx={{ 
                        transition: 'transform 0.2s',
                        transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {user.nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {user.nombre}
                  </Typography>
                </Button>

                {/* User Menu Dropdown */}
                <Menu
                  anchorEl={userMenuAnchor}
                  open={isUserMenuOpen}
                  onClose={() => setUserMenuAnchor(null)}
                  PaperProps={{
                    sx: {
                      width: 320,
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: 3
                    }
                  }}
                >
                  {/* User Info */}
                  <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          fontSize: '1.25rem',
                          fontWeight: 700
                        }}
                      >
                        {user.nombre.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="#111827">
                          {user.nombre}
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                          {user.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Cart Summary */}
                  {cartSummary && cartSummary.totalItems > 0 && (
                    <Box sx={{ px: 2, py: 2, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="#6b7280">
                          Tu carrito
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={600}>
                            {cartSummary.totalItems} productos
                          </Typography>
                          <Typography variant="body2" fontWeight={700} color="#3b82f6">
                            ${cartSummary.total.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Button
                        component={Link}
                        to="/cart"
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{ textTransform: 'none' }}
                      >
                        Ver carrito
                      </Button>
                    </Box>
                  )}

                  {/* Menu Items */}
                  {userMenuItems.map((item) => (
                    <MenuItem
                      key={item.href}
                      component={Link}
                      to={item.href}
                      onClick={() => setUserMenuAnchor(null)}
                      sx={{
                        py: 1.5,
                        bgcolor: item.admin ? '#eff6ff' : 'transparent',
                        borderTop: item.admin ? '1px solid #e5e7eb' : 'none',
                        '&:hover': {
                          bgcolor: item.admin ? '#dbeafe' : '#f9fafb'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <item.icon 
                          sx={{ 
                            fontSize: 20,
                            color: item.admin ? '#3b82f6' : '#9ca3af'
                          }} 
                        />
                      </ListItemIcon>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={600}
                          color={item.admin ? '#1e40af' : '#111827'}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="caption" color="#6b7280">
                          {item.description}
                        </Typography>
                      </Box>
                      {item.admin && (
                        <Shield sx={{ fontSize: 16, color: '#3b82f6', ml: 1 }} />
                      )}
                    </MenuItem>
                  ))}

                  <Divider />

                  {/* Logout */}
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      color: '#ef4444',
                      '&:hover': { bgcolor: '#fef2f2' }
                    }}
                  >
                    <ListItemIcon>
                      <LogOut sx={{ fontSize: 20, color: '#ef4444' }} />
                    </ListItemIcon>
                    <Typography variant="body2" fontWeight={600}>
                      Cerrar sesión
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Guest Actions */
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    display: { xs: 'none', sm: 'flex' },
                    color: '#374151',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { color: '#3b82f6', bgcolor: '#f3f4f6' }
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  startIcon={<User />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Registrarse
                  </Box>
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setIsMenuOpen(true)}
              sx={{
                display: { xs: 'flex', lg: 'none' },
                color: '#6b7280',
                '&:hover': { color: '#3b82f6', bgcolor: '#f3f4f6' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>

        {/* Mobile Search Bar */}
        <Box 
          component="form"
          onSubmit={handleSearch}
          sx={{ 
            display: { xs: 'block', md: 'none' },
            pb: 2
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: 'white',
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit" 
                    size="small"
                    sx={{ 
                      bgcolor: '#3b82f6',
                      color: 'white',
                      '&:hover': { bgcolor: '#2563eb' }
                    }}
                  >
                    <Search sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: { width: 280 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#111827">
              Menú
            </Typography>
            <IconButton onClick={() => setIsMenuOpen(false)} size="small">
              <X />
            </IconButton>
          </Stack>

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.href}
                component={Link}
                to={item.href}
                selected={item.active}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#eff6ff',
                    color: '#3b82f6',
                    '&:hover': { bgcolor: '#dbeafe' }
                  }
                }}
              >
                <ListItemIcon>
                  <item.icon sx={{ color: item.active ? '#3b82f6' : '#6b7280' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white'
                    }}
                  />
                )}
                {item.highlight && (
                  <Sparkles sx={{ ml: 1, fontSize: 16, color: '#3b82f6' }} />
                )}
              </ListItemButton>
            ))}

            {!user && (
              <>
                <Divider sx={{ my: 2 }} />
                <ListItemButton
                  component={Link}
                  to="/login"
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemIcon>
                    <User sx={{ color: '#6b7280' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Iniciar Sesión"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/register"
                  sx={{
                    borderRadius: 2,
                    bgcolor: '#3b82f6',
                    color: 'white',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  <ListItemIcon>
                    <User sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Registrarse"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;