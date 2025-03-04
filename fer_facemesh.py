import cv2
import mediapipe as mp
import os

# Define FaceMesh components
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

# Set the path to one FER-2013 image
image_path = r"C://Users//somis//.cache//kagglehub//datasets//msambare//fer2013//versions//1//fer2013//train//angry//0.jpg"

# Load the image
image = cv2.imread(image_path)
if image is None:
    print("Error: Unable to load image. Check the path!")
    exit()

# Convert BGR to RGB (Required for MediaPipe)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Initialize FaceMesh
with mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5) as face_mesh:

    # Process the image to get facial landmarks
    results = face_mesh.process(image_rgb)

    # Check if face landmarks are detected
    if not results.multi_face_landmarks:
        print("No face detected!")
    else:
        annotated_image = image.copy()
        for face_landmarks in results.multi_face_landmarks:
            # Draw landmarks on the image
            mp_drawing.draw_landmarks(
                image=annotated_image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style()
            )
            mp_drawing.draw_landmarks(
                image=annotated_image,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style()
            )
        
        # Show the output image
        cv2.imshow("FaceMesh on FER-2013 Image", annotated_image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
