import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_csv("dataset/Smart_Farming_Crop_Yield_2024.csv")

print("Dataset Shape:", df.shape)

# Fill missing values
df["irrigation_type"] = df["irrigation_type"].fillna("Unknown")
df["crop_disease_status"] = df["crop_disease_status"].fillna("Unknown")

# Target column
TARGET = "yield_kg_per_hectare"

# Remove columns not useful for prediction
drop_columns = [
    "farm_id"
]

X = df.drop(columns=[TARGET] + drop_columns)
y = df[TARGET]

# Detect column types
categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numeric_features = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("Categorical Features:")
print(categorical_features)

print("\nNumeric Features:")
print(numeric_features)

# Preprocessing
numeric_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median"))
    ]
)

categorical_transformer = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ]
)

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)

# Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

# Full pipeline
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)

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

print("\nModel Performance")
print("------------------")
print("MAE:", round(mae, 2))
print("R² Score:", round(r2, 4))

# Save model
joblib.dump(
    pipeline,
    "models/yield_model.pkl"
)

print("\nModel saved successfully!")
print("Location: models/yield_model.pkl")