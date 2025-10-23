import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  TextField,
  Button,
  IconButton,
  Stack,
  Divider,
  Paper,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  SmartToy as Bot, 
  Favorite as Heart, 
  Email as Mail, 
  Phone, 
  LocationOn as MapPin, 
  GitHub as Github, 
  Twitter, 
  LinkedIn as Linkedin,
  Security as Shield,
  LocalShipping as Truck,
  CreditCard,
  AutoAwesome as Sparkles
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/' },
    { label: 'Chat IA', href: '/chat' },
    { label: 'Mi Carrito', href: '/cart' },
  ];

  const supportLinks = [
    { label: 'Centro de Ayuda', href: '/help' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Términos de Servicio', href: '/terms' },
    { label: 'Política de Privacidad', href: '/privacy' },
  ];

  const features = [
    {
      icon: Bot,
      title: 'IA Inteligente',
      description: 'Asistente de compras 24/7'
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Protección garantizada'
    },
    {
      icon: Truck,
      title: 'Envío Rápido',
      description: 'Entrega en 2-3 días'
    },
    {
      icon: CreditCard,
      title: 'Pago Fácil',
      description: 'Métodos seguros'
    }
  ];

  return (
    <Box component="footer" sx={{ bgcolor: 'white', borderTop: '1px solid #e5e7eb', mt: 'auto' }}>
      {/* Features Bar */}
      <Box sx={{ bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: '#dbeafe',
                      width: 40,
                      height: 40
                    }}
                  >
                    <feature.icon sx={{ fontSize: 20, color: '#3b82f6' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="600" color="#111827">
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" color="#6b7280">
                      {feature.description}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Footer */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
        
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight="600" color="#111827" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link, index) => (
                <MuiLink
                  key={index}
                  component={Link}
                  to={link.href}
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#3b82f6'
                    }
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

        
          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle2" fontWeight="600" color="#111827" gutterBottom>
              Contacto
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Mail sx={{ fontSize: 16, color: '#9ca3af' }} />
                <Typography variant="body2" color="#6b7280">
                  equippQA@carritoai.com
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Phone sx={{ fontSize: 16, color: '#9ca3af' }} />
                <Typography variant="body2" color="#6b7280">
                  +502 1122-3344
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MapPin sx={{ fontSize: 16, color: '#9ca3af' }} />
                <Typography variant="body2" color="#6b7280">
                  Guatemala City, GT
                </Typography>
              </Stack>
            </Stack>

           
          </Grid>
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Box sx={{ borderTop: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.5, sm: 2 }}
              alignItems="center"
            >
              <Typography variant="body2" color="#6b7280">
                © {currentYear} CarritoIA. Todos los derechos reservados.
              </Typography>
              <Typography
                variant="body2"
                color="#6b7280"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                |
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="#6b7280">
                  Proyecto QA
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  Universidad Mariano Gálvez de Guatemala
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center">
              <Typography variant="body2" color="#9ca3af">
                Creado con React & NestJS
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Bot sx={{ fontSize: 16, color: '#3b82f6' }} />
                <Typography variant="body2" fontWeight="600" color="#3b82f6">
                  IA Integrada
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;