import os
import pandas as pd
import numpy as np
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# =====================================================================
# 1. DATA LAYER INITIALIZATION
# =====================================================================
# Reads the consolidated dataset containing all 105 crops and engineered seasons
dataset_path = "dataset/final_training_dataset.csv"

if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"❌ Could not locate '{dataset_path}'. Please ensure Phase 1 dataset generation is run first.")

df = pd.read_csv(dataset_path)
print(f"📦 Successfully loaded data layer. Matrix shape: {df.shape}")
print(f"🌾 Total unique crop classifications recognized: {df['Best_Crop_To_Plant'].nunique()}")

# =====================================================================
# 2. FEATURE HOUSING & PIPELINE SPECIFICATION
# =====================================================================
# Grouping matching features exactly like your fertilizer template architecture
categorical_features = ['Month', 'Season', 'District']
numeric_features = ['Year', 'Soil_PH_Low', 'Soil_PH_High', 'Rainfall_mm', 'Max_Temp_C', 'Min_Temp_C']

# Select structural inputs (X) and target matrix (y)
features = categorical_features + numeric_features
X = df[features]
y = df['Best_Crop_To_Plant']

# Construct the preprocessor transformer block
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
        ('num', 'passthrough', numeric_features)
    ]
)

# Best optimal tree model tuned for 105 structural target boundaries
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=35,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1  # Accelerates training by using all background CPU cores
)

# Combine preprocessor and model cleanly into your deployment pipeline
crop_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# =====================================================================
# 3. BALANCED TRAINING STATE SPLIT
# =====================================================================
# Stratification guarantees a uniform split allocation across all 105 target crops
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.20, 
    random_state=42, 
    stratify=y
)

print(f"📊 Training Matrix: {X_train.shape[0]} samples")
print(f"🧪 Evaluation Matrix: {X_test.shape[0]} samples")

# Run the fit loops
print("\n🌲 Training optimal Tree-Matrix structures inside Pipeline wrapper...")
crop_pipeline.fit(X_train, y_train)
print("🎯 Classification optimization sequence complete.")

# =====================================================================
# 4. METRIC VALIDATION
# =====================================================================
y_pred = crop_pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n🚀 Final Testing Pipeline Accuracy: {accuracy * 100:.2f}%")

# =====================================================================
# 5. SERIALIZATION: GENERATING THE DEPLOYMENT .PKL ARTIFACT
# =====================================================================
output_filename = "models/crops_recommendation_pipeline.pkl"
joblib.dump(crop_pipeline, output_filename)

print(f"💾 Success! Saved background deployment pipeline binary asset to: '{output_filename}'")