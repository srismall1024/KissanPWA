import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Load Dataset
df = pd.read_csv("dataset\\dataset.csv")

# Features
X = df[
    [
        "State",
        "Crop",
        "Production",
        "Yield",
        "Temperature",
        "RainFall Annual",
        "CostCultivation"
    ]
]

# Target
y = df["Price"]

# Categorical Columns
categorical_features = [
    "State",
    "Crop"
]

# Numeric Columns
numeric_features = [
    "Production",
    "Yield",
    "Temperature",
    "RainFall Annual",
    "CostCultivation"
]

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "num",
            "passthrough",
            numeric_features
        )
    ]
)

# Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

# Pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train
pipeline.fit(X_train, y_train)

# Predict
predictions = pipeline.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\nPrice Prediction Model")
print("----------------------")
print("MAE:", round(mae, 2))
print("R² Score:", round(r2, 4))

# Save Model
joblib.dump(
    pipeline,
    "models/price_model.pkl"
)

print("\nprice_model.pkl saved successfully")