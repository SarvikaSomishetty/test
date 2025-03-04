import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv("facial_landmarks.csv")

# Define basic emotion rules
def detect_emotion(row):
    mouth_open = row[60*3+1] - row[50*3+1]  # Difference in y-coordinates of mouth landmarks
    brow_distance = row[21*3] - row[22*3]  # Distance between eyebrows

    if mouth_open > 0.02:
        return "Happy"
    elif brow_distance < 0.01:
        return "Angry"
    else:
        return "Neutral"

# Apply labeling function
df["emotion"] = df.apply(detect_emotion, axis=1)

# Save labeled data
df.to_csv("labeled_facial_landmarks.csv", index=False)

print("✅ Labeled data saved!")
