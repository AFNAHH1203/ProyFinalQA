# main.py
import cv2
from modules.gesture_detector import GestureDetector
from modules.pos_system import POSSystem
from modules.camera_handler import CameraHandler
from config import Config

def draw_ui(frame, fingers_count, action):
    """Dibujar interfaz en el frame"""
    # Dedos detectados
    cv2.putText(frame, f"Dedos: {fingers_count}", 
                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
    
    # Acción ejecutada
    if action:
        action_text = {
            "ADD_TO_CART": "AGREGANDO AL CARRITO",
            "VIEW_CART": "VIENDO CARRITO",
            "CHECKOUT": "REALIZANDO COMPRA"
        }
        cv2.putText(frame, action_text[action], 
                    (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    # Instrucciones
    instructions = "1=Agregar | 2=Ver Carrito | 5=Comprar | Q=Salir"
    cv2.putText(frame, instructions, 
                (10, frame.shape[0] - 20), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

def main():
    print("="*60)
    print("SISTEMA DE PUNTO DE VENTA CON GESTOS".center(60))
    print("="*60)
    print("\nControles por gestos:")
    print("  👆 1 dedo  → Agregar producto al carrito")
    print("  ✌️  2 dedos → Ver contenido del carrito")
    print("  ✋ 5 dedos → Realizar compra")
    print("\nPresiona 'Q' para salir\n")
    print("="*60 + "\n")
    
    try:
        # Inicializar componentes
        camera = CameraHandler()
        gesture_detector = GestureDetector()
        pos_system = POSSystem()
        
        while True:
            success, frame = camera.read_frame()
            if not success:
                print("Error al leer la cámara")
                break
            
            # Detectar gesto
            action, fingers_count, frame = gesture_detector.detect_gesture(frame)
            
            # Ejecutar acción
            if action == "ADD_TO_CART":
                pos_system.add_to_cart()
            elif action == "VIEW_CART":
                pos_system.view_cart()
            elif action == "CHECKOUT":
                pos_system.checkout()
            
            # Dibujar interfaz
            draw_ui(frame, fingers_count, action)
            
            # Mostrar frame
            cv2.imshow('POS - Control por Gestos', frame)
            
            # Salir con 'q'
            if cv2.waitKey(5) & 0xFF == ord('q'):
                break
        
    except Exception as e:
        print(f"Error: {e}")
    
    finally:
        # Limpiar recursos
        camera.release()
        gesture_detector.cleanup()
        print("\n✓ Sistema cerrado correctamente")

if __name__ == "__main__":
    main()