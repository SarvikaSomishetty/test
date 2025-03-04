import cv2
import mediapipe as mp
import pandas as pd

# Initialize FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Initialize OpenCV Video Capture
cap = cv2.VideoCapture(0)

# List to store landmarks
landmarks_list = []

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to RGB (MediaPipe requires RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            landmarks = []
            for landmark in face_landmarks.landmark:
                landmarks.extend([landmark.x, landmark.y, landmark.z])  # Store x, y, z
            landmarks_list.append(landmarks)  # Save frame landmarks

    # Show video
    cv2.imshow("FaceMesh", frame)
    
    # Stop recording with 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Convert to DataFrame & Save to CSV
df = pd.DataFrame(landmarks_list)
df.to_csv("facial_landmarks.csv", index=False)

cap.release()
cv2.destroyAllWindows()

print("✅ Landmark data saved to facial_landmarks.csv")