import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

df = pd.read_csv(
    "dataset\\Crop and fertilizer dataset.csv"
)

features = [
    "District_Name",
    "Soil_color",
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "pH",
    "Rainfall",
    "Temperature",
    "Crop"
]

X = df[features]

y = df["Fertilizer"]

categorical_features = [
    "District_Name",
    "Soil_color",
    "Crop"
]

numeric_features = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "pH",
    "Rainfall",
    "Temperature"
]

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

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

pipeline.fit(X_train, y_train)

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("Fertilizer Recommendation Accuracy:")
print(round(accuracy * 100, 2), "%")

joblib.dump(
    pipeline,
    "models/fertilizer_model.pkl"
)

print("fertilizer_model.pkl saved successfully")