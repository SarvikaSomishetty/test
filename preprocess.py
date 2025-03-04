import numpy as np
import pandas as pd

# Load the dataset
df = pd.read_csv("facial_landmarks.csv")

# Show the first few rows
print(df.head())
# Check for missing values
print(df.isnull().sum().sum())

# Fill missing values with the previous frame’s values (forward fill)
df.fillna(method="ffill", inplace=True)
# Normalize all values between 0 and 1
df = (df - df.min()) / (df.max() - df.min())
print(df.head())


# Convert DataFrame to numpy array
data = df.to_numpy()

# Define sequence length
SEQUENCE_LENGTH = 10

# Create sequences
sequences = []
for i in range(len(data) - SEQUENCE_LENGTH):
    sequences.append(data[i : i + SEQUENCE_LENGTH])  # Take 10 consecutive frames

# Convert to numpy array
sequences = np.array(sequences)

print("✅ Shape of sequences:", sequences.shape)  # (num_samples, sequence_length, num_landmarks)
np.save("processed_facial_landmarks.npy", sequences)
print("✅ Processed data saved!")

