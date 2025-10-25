0# modules/camera_handler.py
import cv2
from config import Config

class CameraHandler:
    def __init__(self, camera_index=Config.CAMERA_INDEX):
        self.cap = cv2.VideoCapture(camera_index)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, Config.CAMERA_WIDTH)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, Config.CAMERA_HEIGHT)
        
        if not self.cap.isOpened():
            raise Exception("No se pudo abrir la cámara")
    
    def read_frame(self):
        """Leer frame de la cámara"""
        success, frame = self.cap.read()
        if success:
            frame = cv2.flip(frame, 1)  # Efecto espejo
        return success, frame
    
    def release(self):
        """Liberar recursos de la cámara"""
        self.cap.release()
        cv2.destroyAllWindows()