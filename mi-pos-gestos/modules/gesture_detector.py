# modules/gesture_detector.py
import cv2
import mediapipe as mp
import time
from config import Config

class GestureDetector:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=Config.MAX_NUM_HANDS,
            min_detection_confidence=Config.MIN_DETECTION_CONFIDENCE,
            min_tracking_confidence=Config.MIN_TRACKING_CONFIDENCE
        )
        
        self.last_gesture_time = 0
        self.gesture_cooldown = Config.GESTURE_COOLDOWN
        
    def count_fingers(self, hand_landmarks):
        """Cuenta cuántos dedos están levantados"""
        fingers_up = []
        
        # Pulgar
        if hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x:
            fingers_up.append(1)
        else:
            fingers_up.append(0)
        
        # Otros dedos
        finger_tips = [8, 12, 16, 20]
        finger_pips = [6, 10, 14, 18]
        
        for tip, pip in zip(finger_tips, finger_pips):
            if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[pip].y:
                fingers_up.append(1)
            else:
                fingers_up.append(0)
        
        return sum(fingers_up)
    
    def detect_gesture(self, image):
        """Detecta el gesto y devuelve la acción correspondiente"""
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.hands.process(image_rgb)
        
        action = None
        fingers_count = 0
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                self.mp_drawing.draw_landmarks(
                    image,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS
                )
                
                fingers_count = self.count_fingers(hand_landmarks)
                
                current_time = time.time()
                if current_time - self.last_gesture_time > self.gesture_cooldown:
                    if fingers_count in Config.GESTURE_ACTIONS:
                        action = Config.GESTURE_ACTIONS[fingers_count]
                        self.last_gesture_time = current_time
        
        return action, fingers_count, image
    
    def cleanup(self):
        """Libera recursos"""
        self.hands.close()