import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  Divider
} from '@mui/material';
import {
  Send,
  SmartToy as Bot,
  Person as User,
  ShoppingCart,
  AutoAwesome as Sparkles,
  Chat as MessageCircle
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! 👋 Soy tu asistente de compras con IA. Puedo ayudarte a encontrar y agregar productos a tu carrito de manera inteligente.\n\n📝 **Ejemplos de lo que puedes decirme:**\n• "Agrega un smartphone al carrito"\n• "Quiero 2 auriculares bluetooth"\n• "Busco auriculares"\n• "Añadir productos para música"\n\n¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { addToCartByAI, cart } = useCart();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processAIMessage = async (message) => {
    if (!user) {
      return {
        type: 'error',
        content: '🔐 Necesitas iniciar sesión para agregar productos al carrito.\n\n[Puedes explorar productos sin cuenta, pero para comprar necesitas registrarte]'
      };
    }

    const addPatterns = [
      /agrega\s+(.+)/i,
      /agregar\s+(.+)/i,
      /quiero\s+(.+)/i,
      /añadir\s+(.+)/i,
      /añade\s+(.+)/i,
      /comprar\s+(.+)/i,
      /busco\s+(.+)/i,
      /necesito\s+(.+)/i,
      /me\s+interesa\s+(.+)/i
    ];

    const quantityPatterns = [
      { pattern: /(\d+)\s+(.+)/, getQuantity: (match) => parseInt(match[1]), getProduct: (match) => match[2] },
      { pattern: /(.+)\s+(\d+)/, getQuantity: (match) => parseInt(match[2]), getProduct: (match) => match[1] },
      { pattern: /(un|una|uno)\s+(.+)/i, getQuantity: () => 1, getProduct: (match) => match[2] },
      { pattern: /(dos)\s+(.+)/i, getQuantity: () => 2, getProduct: (match) => match[2] },
      { pattern: /(tres)\s+(.+)/i, getQuantity: () => 3, getProduct: (match) => match[2] },
      { pattern: /(cuatro)\s+(.+)/i, getQuantity: () => 4, getProduct: (match) => match[2] },
      { pattern: /(cinco)\s+(.+)/i, getQuantity: () => 5, getProduct: (match) => match[2] }
    ];

    let productName = '';
    let quantity = 1;
    let foundPattern = false;

    for (const pattern of addPatterns) {
      const match = message.match(pattern);
      if (match) {
        productName = match[1].trim();
        foundPattern = true;
        break;
      }
    }

    if (!foundPattern) {
      productName = message.trim();
    }

    for (const { pattern, getQuantity, getProduct } of quantityPatterns) {
      const match = productName.match(pattern);
      if (match) {
        quantity = getQuantity(match);
        productName = getProduct(match).trim();
        break;
      }
    }

    productName = productName
      .replace(/al carrito/gi, '')
      .replace(/por favor/gi, '')
      .replace(/gracias/gi, '')
      .replace(/\bpara\b/gi, '')
      .replace(/\ben\b/gi, '')
      .trim();

    if (!productName) {
      return {
        type: 'help',
        content: '🤔 No pude identificar qué producto quieres agregar.\n\n💡 **Intenta ser más específico:**\n• "Agrega un smartphone"\n• "Quiero auriculares bluetooth"\n• "Busco productos para música"\n\n¿Qué producto te interesa?'
      };
    }

    const success = await addToCartByAI(productName, quantity);
    
    if (success) {
      return {
        type: 'success',
        content: `✅ ¡Perfecto! He agregado **"${productName}"** a tu carrito.\n\n📦 **Detalles:**\n• Cantidad: ${quantity}\n• Total de productos en carrito: ${cart?.cantidadTotal || 0}\n\n¿Hay algo más que te gustaría agregar?`
      };
    } else {
      return {
        type: 'error',
        content: `❌ No pude encontrar **"${productName}"** en nuestros productos disponibles.\n\n🔍 **Productos disponibles:**\n• Smartphone Galaxy\n• Auriculares Bluetooth\n\n💡 **Sugerencia:** Intenta con nombres más específicos o revisa nuestro catálogo.`
      };
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await processAIMessage(currentInput);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        messageType: response.type,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '😅 Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.',
        messageType: 'error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { text: "Agrega un smartphone", icon: "📱" },
    { text: "Quiero auriculares", icon: "🎧" },
    { text: "¿Qué productos tienes?", icon: "❓" },
    { text: "Ver mi carrito", icon: "🛒" }
  ];

  const getMessageColor = (messageType) => {
    switch (messageType) {
      case 'success':
        return { bgcolor: '#d1fae5', borderColor: '#10b981' };
      case 'error':
        return { bgcolor: '#fee2e2', borderColor: '#ef4444' };
      case 'help':
        return { bgcolor: '#dbeafe', borderColor: '#3b82f6' };
      default:
        return { bgcolor: '#f3f4f6', borderColor: '#e5e7eb' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 4 }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={3} 
          sx={{ 
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'white'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: 'white',
              p: 3
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'white',
                  color: '#3b82f6',
                  position: 'relative'
                }}
              >
                <Bot sx={{ fontSize: 32 }} />
                <Sparkles
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 20,
                    color: '#fbbf24'
                  }}
                />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  Asistente de Compras IA
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Dime qué necesitas y yo lo agregaré a tu carrito automáticamente
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', animation: 'pulse 2s infinite' }} />}
                label="IA Activa"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              {user && cart && (
                <Chip
                  icon={<ShoppingCart sx={{ fontSize: 16 }} />}
                  label={`${cart.cantidadTotal || 0} productos en carrito`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Stack>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 3,
              bgcolor: '#fafafa',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: '#d1d5db',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: '#9ca3af',
                }
              }
            }}
          >
            <Stack spacing={2}>
              {messages.map((message) => (
                <Fade key={message.id} in timeout={300}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: 1
                    }}
                  >
                    {message.type === 'bot' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: message.messageType === 'success' ? '#10b981' : 
                                   message.messageType === 'error' ? '#ef4444' : 
                                   '#3b82f6',
                          fontSize: 16
                        }}
                      >
                        <Bot sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}

                    <Paper
                      elevation={1}
                      sx={{
                        maxWidth: '75%',
                        p: 2,
                        borderRadius: 2,
                        ...(message.type === 'user' 
                          ? {
                              bgcolor: '#3b82f6',
                              color: 'white',
                              borderBottomRightRadius: 4
                            }
                          : {
                              ...getMessageColor(message.messageType),
                              border: '1px solid',
                              borderBottomLeftRadius: 4
                            }
                        )
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          color: message.type === 'user' ? 'white' : '#111827',
                          '& strong': {
                            fontWeight: 700
                          }
                        }}
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />')
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          opacity: 0.7,
                          color: message.type === 'user' ? 'white' : '#6b7280'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>

                    {message.type === 'user' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#6b7280'
                        }}
                      >
                        <User sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                  </Box>
                </Fade>
              ))}

              {loading && (
                <Fade in timeout={300}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                      <Bot sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: '#f3f4f6',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="#6b7280">
                          Procesando tu solicitud...
                        </Typography>
                      </Stack>
                    </Paper>
                  </Box>
                </Fade>
              )}

              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          {/* Quick Actions */}
          {!loading && (
            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="caption" color="#6b7280" sx={{ mb: 1, display: 'block' }}>
                Acciones rápidas:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    label={`${action.icon} ${action.text}`}
                    onClick={() => setInput(action.text)}
                    clickable
                    size="small"
                    sx={{
                      bgcolor: '#f3f4f6',
                      color: '#374151',
                      '&:hover': {
                        bgcolor: '#e5e7eb'
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid #e5e7eb' }}>
            {!user && (
              <Alert
                severity="warning"
                icon={<MessageCircle />}
                sx={{ mb: 2 }}
              >
                Necesitas iniciar sesión para agregar productos al carrito
              </Alert>
            )}

            <Stack direction="row" spacing={2} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Agrega 2 smartphones al carrito..."
                disabled={loading}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#f9fafb',
                    borderRadius: 2,
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
                    },
                  },
                }}
              />
              <IconButton
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                sx={{
                  bgcolor: '#3b82f6',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: '#2563eb'
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#e5e7eb',
                    color: '#9ca3af'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : <Send />}
              </IconButton>
            </Stack>

            <Typography variant="caption" color="#9ca3af" sx={{ display: 'block', mt: 1 }}>
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </Typography>
          </Box>
        </Paper>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
};

export default ChatPage;