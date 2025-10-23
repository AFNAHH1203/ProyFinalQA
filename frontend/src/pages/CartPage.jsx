import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Delete as Trash2,
  Add as Plus,
  Remove as Minus,
  ShoppingBag,
  ArrowBack as ArrowLeft,
  CreditCard,
  LocalShipping as Truck,
  Security as Shield,
  Schedule as Clock,
  CardGiftcard as Gift,
  Warning as AlertCircle,
  CheckCircle,
  Inventory as Package
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Cálculos de precios
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.15;
  const discount = subtotal > 1000 ? subtotal * 0.05 : 0;
  const finalTotal = subtotal + shipping + tax - discount;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId, productName) => {
    try {
      await removeItem(itemId);
      toast.success(`${productName} eliminado del carrito`);
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setShowClearModal(false);
      toast.success('Carrito vaciado exitosamente');
    } catch (error) {
      toast.error('Error al vaciar carrito');
    }
  };

  const handleCheckout = async () => {

    // Vaciar el carrito pero SIN cerrar el modal automáticamente
    try {
      setShowCheckoutModal(true);
    } catch (error) {
      toast.error('Error al procesar el pedido');
    }

  };

  const handleCloseCheckoutModal = () => {
    clearCart();
  };

  // No autenticado
  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 3, bgcolor: '#dbeafe' }}>
              <ShoppingBag sx={{ fontSize: 50, color: '#3b82f6' }} />
            </Avatar>

            <Typography variant="h4" fontWeight="bold" gutterBottom color="#111827">
              Inicia sesión para ver tu carrito
            </Typography>
            <Typography variant="body1" color="#6b7280" sx={{ mb: 4 }}>
              Necesitas una cuenta para guardar productos en tu carrito de compras y acceder a todas nuestras funcionalidades.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<ArrowLeft />}
              >
                Iniciar Sesión
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
              >
                Crear Cuenta Gratis
              </Button>
            </Stack>

            <Paper sx={{ p: 3, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <Typography variant="body2" color="#6b7280" gutterBottom>
                ¿Quieres explorar sin cuenta?
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="text"
                color="primary"
              >
                Ver productos disponibles
              </Button>
            </Paper>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Loading
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h5" color="#111827">Cargando tu carrito...</Typography>
          <Typography variant="body2" color="#6b7280">Preparando tus productos favoritos</Typography>
        </Stack>
      </Box>
    );
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, bgcolor: '#dbeafe' }}>
              <ShoppingBag sx={{ fontSize: 60, color: '#3b82f6' }} />
            </Avatar>

            <Typography variant="h3" fontWeight="bold" gutterBottom color="#111827">
              Tu carrito está vacío
            </Typography>
            <Typography variant="body1" color="#6b7280" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
              Parece que no has agregado ningún producto todavía. ¡Explora nuestro catálogo y encuentra productos increíbles!
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                startIcon={<Package />}
              >
                Ver Productos
              </Button>
              <Button
                component={Link}
                to="/chat"
                variant="outlined"
                size="large"
                startIcon={<Gift />}
              >
                Usar Chat IA
              </Button>
            </Stack>

            <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto', bgcolor: 'white' }}>
              <Typography variant="body2" fontWeight="600" gutterBottom>
                💡 Consejo
              </Typography>
              <Typography variant="body2">
                Usa nuestro Chat IA para encontrar productos fácilmente. Solo dile qué necesitas como "quiero auriculares" y él se encargará del resto.
              </Typography>
            </Alert>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #e5e7eb'
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#111827" gutterBottom>
                Mi Carrito de Compras
              </Typography>
              <Typography variant="body1" color="#6b7280">
                {cart.cantidadTotal} producto{cart.cantidadTotal !== 1 ? 's' : ''} en tu carrito •
                Total: <Typography component="span" fontWeight="bold" color="#3b82f6">Q{finalTotal.toLocaleString()}</Typography>
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                startIcon={<ArrowLeft />}
                sx={{ color: '#6b7280', borderColor: '#d1d5db' }}
              >
                Seguir comprando
              </Button>
              <Button
                onClick={() => setShowClearModal(true)}
                variant="outlined"
                color="error"
                startIcon={<Trash2 />}
              >
                Vaciar carrito
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Shipping Progress */}
        {subtotal < 500 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #e5e7eb'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="600" color="#111827">
                🚚 ¡Envío gratis a partir de Q500!
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="#3b82f6">
                Te faltan Q{(500 - subtotal).toLocaleString()}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min((subtotal / 500) * 100, 100)}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: '#e5e7eb',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#3b82f6',
                  borderRadius: 1
                }
              }}
            />
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={2}>
              {cart.items.map((item) => (
                <Card
                  key={item.id}
                  elevation={0}
                  sx={{
                    bgcolor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      {/* Image */}
                      <Grid item xs={12} sm={3} md={2}>
                        <Box
                          sx={{
                            width: '100%',
                            height: 120,
                            bgcolor: '#f3f4f6',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          {item.producto.imagenUrl ? (
                            <img
                              src={`http://localhost:3000/qa/productos/imagen/${item.producto.imagenUrl}`}
                              alt={item.producto.nombre}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package sx={{ fontSize: 40, color: '#9ca3af' }} />
                          )}
                        </Box>
                      </Grid>

                      {/* Info */}
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography variant="h6" fontWeight="600" color="#111827" gutterBottom>
                          {item.producto.nombre}
                        </Typography>
                        <Typography variant="body2" color="#6b7280" gutterBottom>
                          Q{item.producto.precio.toLocaleString()} por unidad
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Chip
                            icon={<Clock sx={{ fontSize: 16 }} />}
                            label={`Agregado ${new Date(item.fechaAgregado).toLocaleDateString()}`}
                            size="small"
                            sx={{ bgcolor: '#f3f4f6', color: '#6b7280' }}
                          />
                          <Chip
                            icon={<CheckCircle sx={{ fontSize: 16, color: 'white !important' }} />}
                            label="En stock"
                            size="small"
                            sx={{
                              bgcolor: '#10b981',
                              color: 'white',
                              fontWeight: 600,
                              '& .MuiChip-label': {
                                color: 'white'
                              }
                            }}
                          />
                        </Stack>
                      </Grid>

                      {/* Quantity */}
                      <Grid item xs={12} sm={2} md={3}>
                        <Stack spacing={1} alignItems="center">
                          <Paper
                            elevation={0}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid #e5e7eb',
                              borderRadius: 2,
                              bgcolor: 'white'
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1 || updatingItems.has(item.id)}
                              sx={{ color: '#6b7280' }}
                            >
                              <Minus />
                            </IconButton>

                            <Box sx={{ px: 2, minWidth: 40, textAlign: 'center' }}>
                              {updatingItems.has(item.id) ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Typography variant="body1" fontWeight="600" color="#111827">
                                  {item.cantidad}
                                </Typography>
                              )}
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                              disabled={updatingItems.has(item.id)}
                              sx={{ color: '#6b7280' }}
                            >
                              <Plus />
                            </IconButton>
                          </Paper>
                          <Typography variant="caption" color="#9ca3af">
                            Cantidad
                          </Typography>
                        </Stack>
                      </Grid>

                      {/* Price & Remove */}
                      <Grid item xs={12} sm={2} md={3}>
                        <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                          <Typography variant="h6" fontWeight="bold" color="#3b82f6">
                            Q{item.subtotal.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="#6b7280">
                            {item.cantidad} × Q{item.producto.precio.toLocaleString()}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id, item.producto.nombre)}
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            <Trash2 />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'white',
                borderRadius: 2,
                position: 'sticky',
                top: 20,
                border: '1px solid #e5e7eb'
              }}
            >
              <Stack spacing={3}>
                {/* Title */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <CreditCard sx={{ color: '#3b82f6' }} />
                  <Typography variant="h6" fontWeight="bold" color="#111827">
                    Resumen del pedido
                  </Typography>
                </Stack>

                <Divider />

                {/* Price Breakdown */}
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="#6b7280">
                      Subtotal ({cart.cantidadTotal} productos)
                    </Typography>
                    <Typography variant="body2" fontWeight="600" color="#111827">
                      Q{subtotal.toLocaleString()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="#6b7280">
                      Envío
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={shipping === 0 ? '#10b981' : '#111827'}
                    >
                      {shipping === 0 ? 'Gratis' : `Q${shipping}`}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="#6b7280">
                      Impuestos (15%)
                    </Typography>
                    <Typography variant="body2" fontWeight="600" color="#111827">
                      Q{tax.toLocaleString()}
                    </Typography>
                  </Stack>

                  {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="#6b7280">
                        Descuento (5%)
                      </Typography>
                      <Typography variant="body2" fontWeight="600" color="#10b981">
                        -Q{discount.toLocaleString()}
                      </Typography>
                    </Stack>
                  )}

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight="bold" color="#111827">
                      Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#3b82f6">
                      Q{finalTotal.toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<CreditCard />}
                  onClick={handleCheckout}
                  sx={{ py: 1.5, fontSize: '1rem' }}
                >
                  Proceder al pago
                </Button>

                {/* Security Badges */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Chip
                    icon={<Shield sx={{ color: '#10b981 !important' }} />}
                    label="Compra segura"
                    size="small"
                    sx={{ bgcolor: '#d1fae5', color: '#059669' }}
                  />
                  <Chip
                    icon={<Truck sx={{ color: '#3b82f6 !important' }} />}
                    label="Envío rápido"
                    size="small"
                    sx={{ bgcolor: '#dbeafe', color: '#2563eb' }}
                  />
                </Stack>

                {/* Shipping Info */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: shipping === 0 ? '#FFFFFF' : '#1e3a8a',
                    border: `2px solid ${shipping === 0 ? '#10b981' : '#3b82f6'}`,
                    borderRadius: 2,
                    p: 2
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Truck sx={{ color: shipping === 0 ? '#10b981' : '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'black', fontWeight: 600 }}>
                      {shipping === 0 ? '🎉 ¡Envío gratuito!' : 'Información de envío'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    {shipping === 0
                      ? 'Tu pedido califica para envío gratis. Será enviado en 2-3 días hábiles.'
                      : 'Envío en 2-3 días hábiles. ¡Envío gratis en compras de Q500 o más!'
                    }
                  </Typography>
                </Paper>

                {/* Discount Promo */}
                {subtotal < 1000 && (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#FFFFFF',
                      border: '2px solid #f59e0b',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Gift sx={{ color: '#f59e0b', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: 'black', fontWeight: 600 }}>
                        🎁 ¡Descuento del 5%!
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'black', }}>
                      Agrega Q{(1000 - subtotal).toLocaleString()} más para obtener un 5% de descuento.
                    </Typography>
                  </Paper>
                )}

                {/* Continue Shopping */}
                <Button
                  component={Link}
                  to="/"
                  variant="text"
                  startIcon={<ArrowLeft />}
                  fullWidth
                  sx={{ color: '#6b7280' }}
                >
                  Continúa comprando
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Clear Cart Modal */}
        <Dialog
          open={showClearModal}
          onClose={() => setShowClearModal(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#fee2e2' }}>
                <Trash2 sx={{ color: '#ef4444' }} />
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="#111827">
                ¿Vaciar carrito?
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="#6b7280">
              Esta acción eliminará todos los productos de tu carrito. ¿Estás seguro de que quieres continuar?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setShowClearModal(false)}
              variant="outlined"
              sx={{ color: '#6b7280', borderColor: '#d1d5db' }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleClearCart}
              variant="contained"
              color="error"
            >
              Sí, vaciar carrito
            </Button>
          </DialogActions>
        </Dialog>
        {/* Checkout Success Modal */}
        <Dialog
          open={showCheckoutModal}
          onClose={handleCloseCheckoutModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              p: 4,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Botón X para cerrar con borde rojo */}
            <IconButton
              onClick={handleCloseCheckoutModal}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'white',
                border: '2px solid #ef4444',
                zIndex: 1,
                '&:hover': {
                  bgcolor: '#fef2f2',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s'
                }
              }}
            >
              
            </IconButton>

            {/* Icono animado de éxito */}
            <Box
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 3,
                bgcolor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 0.6s ease-in-out',
                '@keyframes bounce': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                }
              }}
            >
              <CheckCircle sx={{ fontSize: 60, color: '#10b981' }} />
            </Box>

            {/* Título */}
            <Typography variant="h3" fontWeight="bold" color="white" gutterBottom>
              ¡Gracias por tu compra!
            </Typography>

            {/* Subtítulo */}
            <Typography variant="h6" color="rgba(255, 255, 255, 0.9)" sx={{ mb: 3 }}>
              Tu pedido ha sido procesado exitosamente
            </Typography>

            {/* Detalles del pedido */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="#6b7280">
                    Número de orden:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="#111827">
                    #ORD-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="#6b7280">
                    Total pagado:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="#10b981">
                    Q{finalTotal.toLocaleString()}
                  </Typography>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="#6b7280">
                    Productos:
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#111827">
                    {cart?.cantidadTotal || 0} {(cart?.cantidadTotal || 0) === 1 ? 'artículo' : 'artículos'}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>

            {/* Información adicional */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Truck sx={{ color: 'white', fontSize: 24 }} />
                  <Typography variant="body2" color="white" fontWeight="600">
                    Envío estimado: 2-3 días hábiles
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <Shield sx={{ color: 'white', fontSize: 24 }} />
                  <Typography variant="body2" color="white" fontWeight="600">
                    Compra 100% segura y protegida
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            {/* Mensaje final */}
            <Typography variant="body2" color="rgba(255, 255, 255, 0.9)" sx={{ mb: 3 }}>
              Recibirás un correo de confirmación con los detalles de tu pedido
            </Typography>

            {/* Botones */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#10b981',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#f3f4f6'
                  }
                }}
              >
                Seguir comprando
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleCloseCheckoutModal}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Cerrar
              </Button>
            </Stack>
          </Box>
        </Dialog>

      </Container>
    </Box>
  );
};

export default CartPage;