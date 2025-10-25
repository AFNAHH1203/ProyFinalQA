# config.py
class Config:
    # Configuración de la cámara
    CAMERA_INDEX = 0
    CAMERA_WIDTH = 1280
    CAMERA_HEIGHT = 720
    
    # Configuración de MediaPipe
    MIN_DETECTION_CONFIDENCE = 0.7
    MIN_TRACKING_CONFIDENCE = 0.7
    MAX_NUM_HANDS = 1
    
    # Configuración de gestos
    GESTURE_COOLDOWN = 2  # segundos
    
    # Mapeo de gestos a acciones
    GESTURE_ACTIONS = {
        1: "ADD_TO_CART",
        2: "VIEW_CART",
        5: "CHECKOUT"
    }
    
    # Configuración del POS
    CURRENCY = "$"
    TAX_RATE = 0.16  # 16% IVA (ajusta según tu país)