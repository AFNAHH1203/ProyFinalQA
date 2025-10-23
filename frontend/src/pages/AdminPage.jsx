import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse
} from '@mui/material';
import {
  Add as Plus,
  Edit,
  Delete as Trash2,
  Inventory as Package,
  Save,
  Close as X,
  Visibility as Eye,
  BarChart as BarChart3
} from '@mui/icons-material';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const { control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const { user } = useAuth();

  const watchedImageUrl = watch('imagenUrl');
  const watchedName = watch('nombre');
  const watchedPrice = watch('precio');
  const watchedStock = watch('stock');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const productData = {
        ...data,
        precio: parseFloat(data.precio),
        stock: parseInt(data.stock) || 0
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.createProduct(productData);
        toast.success('Producto creado exitosamente');
      }

      reset();
      setShowCreateForm(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar producto');
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    reset(product);
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowCreateForm(false);
    reset();
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Producto eliminado exitosamente');
        await loadProducts();
      } catch (error) {
        toast.error('Error al eliminar producto');
      }
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: '#e5e7eb' }}>
            <Package sx={{ fontSize: 40, color: '#9ca3af' }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="#111827" gutterBottom>
            Acceso Restringido
          </Typography>
          <Typography variant="body1" color="#6b7280">
            Necesitas iniciar sesión para acceder al panel de administración.
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="body1" color="#6b7280">
            Cargando panel de administración...
          </Typography>
        </Stack>
      </Box>
    );
  }

  const totalValue = products.reduce((sum, product) => sum + (product.precio * product.stock), 0);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter(product => product.stock <= 5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#111827" gutterBottom>
              Panel de Administración
            </Typography>
            <Typography variant="body1" color="#6b7280">
              Gestiona tu inventario de productos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => setShowCreateForm(true)}
            sx={{
              bgcolor: '#3b82f6',
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.5,
              alignSelf: { xs: 'flex-start', lg: 'center' },
              '&:hover': { bgcolor: '#2563eb' }
            }}
          >
            Nuevo Producto
          </Button>
        </Stack>

        {/* Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#dbeafe', width: 48, height: 48 }}>
                    <Package sx={{ color: '#3b82f6' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="#6b7280" fontWeight={500}>
                      Total Productos
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#111827">
                      {products.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#d1fae5', width: 48, height: 48 }}>
                    <BarChart3 sx={{ color: '#10b981' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="#6b7280" fontWeight={500}>
                      Valor Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#111827">
                      ${totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#dbeafe', width: 48, height: 48 }}>
                    <Package sx={{ color: '#3b82f6' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="#6b7280" fontWeight={500}>
                      Stock Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#111827">
                      {totalStock}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#fee2e2', width: 48, height: 48 }}>
                    <Package sx={{ color: '#ef4444' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="#6b7280" fontWeight={500}>
                      Stock Bajo
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="#111827">
                      {lowStockProducts.length}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Create/Edit Form */}
        <Collapse in={showCreateForm}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#111827">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </Typography>
              <IconButton onClick={cancelEdit} size="small">
                <X />
              </IconButton>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Form Fields */}
                <Grid item xs={12} lg={8}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                          Nombre *
                        </Typography>
                        <Controller
                          name="nombre"
                          control={control}
                          defaultValue=""
                          rules={{ required: 'Nombre es requerido' }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              placeholder="Nombre del producto"
                              error={!!errors.nombre}
                              helperText={errors.nombre?.message}
                              sx={{
                                '& .MuiInputBase-root': { bgcolor: 'white', color: '#111827' },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { borderColor: errors.nombre ? '#ef4444' : '#d1d5db' },
                                  '&:hover fieldset': { borderColor: errors.nombre ? '#ef4444' : '#9ca3af' },
                                  '&.Mui-focused fieldset': { borderColor: errors.nombre ? '#ef4444' : '#3b82f6' }
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                          Precio *
                        </Typography>
                        <Controller
                          name="precio"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: 'Precio es requerido',
                            min: { value: 0, message: 'El precio debe ser mayor a 0' }
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type="number"
                              inputProps={{ step: '0.01' }}
                              placeholder="0.00"
                              error={!!errors.precio}
                              helperText={errors.precio?.message}
                              sx={{
                                '& .MuiInputBase-root': { bgcolor: 'white', color: '#111827' },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { borderColor: errors.precio ? '#ef4444' : '#d1d5db' },
                                  '&:hover fieldset': { borderColor: errors.precio ? '#ef4444' : '#9ca3af' },
                                  '&.Mui-focused fieldset': { borderColor: errors.precio ? '#ef4444' : '#3b82f6' }
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                          Stock
                        </Typography>
                        <Controller
                          name="stock"
                          control={control}
                          defaultValue=""
                          rules={{ min: { value: 0, message: 'El stock no puede ser negativo' } }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type="number"
                              placeholder="0"
                              error={!!errors.stock}
                              helperText={errors.stock?.message}
                              sx={{
                                '& .MuiInputBase-root': { bgcolor: 'white', color: '#111827' },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { borderColor: errors.stock ? '#ef4444' : '#d1d5db' },
                                  '&:hover fieldset': { borderColor: errors.stock ? '#ef4444' : '#9ca3af' },
                                  '&.Mui-focused fieldset': { borderColor: errors.stock ? '#ef4444' : '#3b82f6' }
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                          URL de Imagen
                        </Typography>
                        <Controller
                          name="imagenUrl"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              type="url"
                              placeholder="https://ejemplo.com/imagen.jpg"
                              sx={{
                                '& .MuiInputBase-root': { bgcolor: 'white', color: '#111827' },
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { borderColor: '#d1d5db' },
                                  '&:hover fieldset': { borderColor: '#9ca3af' },
                                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                }
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Box>
                      <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                        Descripción
                      </Typography>
                      <Controller
                        name="descripcion"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Descripción detallada del producto"
                            sx={{
                              '& .MuiInputBase-root': { bgcolor: 'white', color: '#111827' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#d1d5db' },
                                '&:hover fieldset': { borderColor: '#9ca3af' },
                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                              }
                            }}
                          />
                        )}
                      />
                    </Box>

                    <Stack direction="row" spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save />}
                        disabled={isSubmitting}
                        sx={{
                          bgcolor: '#3b82f6',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#2563eb' },
                          '&.Mui-disabled': { bgcolor: '#9ca3af', color: 'white' }
                        }}
                      >
                        {isSubmitting ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={cancelEdit}
                        sx={{
                          color: '#6b7280',
                          borderColor: '#d1d5db',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                        }}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                {/* Preview */}
                <Grid item xs={12} lg={4}>
                  <Paper elevation={0} sx={{ p: 3, bgcolor: '#f9fafb', borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                      Vista Previa
                    </Typography>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 2 }}>
                      <Box
                        sx={{
                          height: 128,
                          bgcolor: '#e5e7eb',
                          borderRadius: 1,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {watchedImageUrl ? (
                          <img
                            src={watchedImageUrl}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package sx={{ fontSize: 32, color: '#9ca3af' }} />
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight={600} color="#111827" gutterBottom>
                        {watchedName || 'Nombre del producto'}
                      </Typography>
                      <Typography variant="h6" color="#3b82f6" fontWeight="bold">
                        ${watchedPrice || '0.00'}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        Stock: {watchedStock || '0'}
                      </Typography>
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Collapse>

        {/* Products Table */}
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ px: 3, py: 2, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" fontWeight="bold" color="#111827">
              Productos ({products.length})
            </Typography>
          </Box>

          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: '#e5e7eb' }}>
                <Package sx={{ fontSize: 32, color: '#9ca3af' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="#111827" gutterBottom>
                No hay productos
              </Typography>
              <Typography variant="body2" color="#6b7280" sx={{ mb: 3 }}>
                Comienza agregando tu primer producto al inventario.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowCreateForm(true)}
                sx={{
                  bgcolor: '#3b82f6',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#2563eb' }
                }}
              >
                Crear Primer Producto
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f9fafb' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Producto
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Precio
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Stock
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Valor Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Fecha
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={product.imagenUrl}
                            variant="rounded"
                            sx={{ width: 48, height: 48, bgcolor: '#e5e7eb' }}
                          >
                            <Package sx={{ color: '#9ca3af' }} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="#111827">
                              {product.nombre}
                            </Typography>
                            <Typography variant="caption" color="#6b7280" sx={{ maxWidth: 300, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.descripcion}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#111827">
                          ${product.precio.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${product.stock} unidades`}
                          size="small"
                          sx={{
                            bgcolor: product.stock > 10 ? '#d1fae5' : product.stock > 0 ? '#fef3c7' : '#fee2e2',
                            color: product.stock > 10 ? '#065f46' : product.stock > 0 ? '#92400e' : '#991b1b',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#111827">
                          ${(product.precio * product.stock).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#6b7280">
                          {new Date(product.fechaCreacion).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <IconButton size="small" sx={{ color: '#3b82f6' }} title="Ver producto">
                            <Eye fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => startEdit(product)} sx={{ color: '#3b82f6' }} title="Editar">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => deleteProduct(product.id)} sx={{ color: '#ef4444' }} title="Eliminar">
                            <Trash2 fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Alert
            severity="error"
            sx={{
              bgcolor: '#fee2e2',
              border: '1px solid #fecaca',
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography variant="body2" fontWeight={600} color="#991b1b" gutterBottom>
              ⚠️ Productos con stock bajo ({lowStockProducts.length})
            </Typography>
            <Stack spacing={0.5}>
              {lowStockProducts.map(product => (
                <Typography key={product.id} variant="caption" color="#991b1b">
                  • {product.nombre}: {product.stock} unidades restantes
                </Typography>
              ))}
            </Stack>
          </Alert>
        )}
      </Stack>
    </Container>
  );
};

export default AdminPage;