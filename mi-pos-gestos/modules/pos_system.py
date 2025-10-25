# modules/pos_system.py
from datetime import datetime
from config import Config

class POSSystem:
    def __init__(self):
        self.cart = []
        self.total = 0
        self.subtotal = 0
        self.tax = 0
        
        # Producto de ejemplo (luego lo conectarás con tu BD)
        self.current_product = {
            "id": "001",
            "name": "Producto Ejemplo",
            "price": 10.50,
            "quantity": 1
        }
        
    def add_to_cart(self):
        """Agregar producto al carrito"""
        product = self.current_product.copy()
        self.cart.append(product)
        self._calculate_totals()
        
        print(f"\n✓ Producto agregado: {product['name']}")
        print(f"  Precio: {Config.CURRENCY}{product['price']:.2f}")
        print(f"  Total de productos: {len(self.cart)}")
        
        return True
    
    def view_cart(self):
        """Ver contenido del carrito"""
        print("\n" + "="*60)
        print("CARRITO DE COMPRAS".center(60))
        print("="*60)
        
        if not self.cart:
            print("El carrito está vacío".center(60))
        else:
            print(f"{'#':<5} {'Producto':<30} {'Cant.':<8} {'Precio':<10}")
            print("-"*60)
            
            for i, item in enumerate(self.cart, 1):
                print(f"{i:<5} {item['name']:<30} {item['quantity']:<8} "
                      f"{Config.CURRENCY}{item['price']:.2f}")
            
            print("-"*60)
            print(f"{'Subtotal:':<50} {Config.CURRENCY}{self.subtotal:.2f}")
            print(f"{'IVA (' + str(Config.TAX_RATE*100) + '%):':<50} "
                  f"{Config.CURRENCY}{self.tax:.2f}")
            print(f"{'TOTAL:':<50} {Config.CURRENCY}{self.total:.2f}")
        
        print("="*60 + "\n")
        
    def checkout(self):
        """Realizar la compra"""
        if not self.cart:
            print("\n⚠ No hay productos en el carrito")
            return False
        
        print("\n" + "="*60)
        print("TICKET DE COMPRA".center(60))
        print("="*60)
        print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-"*60)
        
        for i, item in enumerate(self.cart, 1):
            print(f"{i}. {item['name']:<30} {Config.CURRENCY}{item['price']:.2f}")
        
        print("-"*60)
        print(f"{'Subtotal:':<50} {Config.CURRENCY}{self.subtotal:.2f}")
        print(f"{'IVA:':<50} {Config.CURRENCY}{self.tax:.2f}")
        print(f"{'TOTAL A PAGAR:':<50} {Config.CURRENCY}{self.total:.2f}")
        print("="*60)
        print("✓ COMPRA REALIZADA CON ÉXITO".center(60))
        print("="*60 + "\n")
        
        # Guardar venta (aquí conectarías con tu BD)
        self._save_sale()
        
        # Limpiar carrito
        self.cart = []
        self.total = 0
        self.subtotal = 0
        self.tax = 0
        
        return True
    
    def _calculate_totals(self):
        """Calcular totales con impuestos"""
        self.subtotal = sum(item['price'] * item['quantity'] for item in self.cart)
        self.tax = self.subtotal * Config.TAX_RATE
        self.total = self.subtotal + self.tax
    
    def _save_sale(self):
        """Guardar venta en base de datos"""
        # TODO: Implementar guardado en BD
        pass
    
    def set_current_product(self, product):
        """Establecer el producto actual a agregar"""
        self.current_product = product