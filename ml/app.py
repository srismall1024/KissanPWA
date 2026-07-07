from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained models
model = joblib.load("models/yield_model.pkl")
fertilizer_model = joblib.load("models/fertilizer_model.pkl")
price_model = joblib.load("models/price_model.pkl")

# Integrated your new optimized Pipeline model containing all 105 crops
crop_pipeline = joblib.load("models/crops_recommendation_pipeline.pkl")


@app.route("/")
def home():
    return "Yield Prediction API Running"


@app.route("/predict-yield", methods=["POST"])
def predict_yield():
    try:
        data = request.json
        input_df = pd.DataFrame([data])
        prediction = model.predict(input_df)
        return jsonify({
            "success": True,
            "predicted_yield": round(float(prediction[0]), 2)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/recommend-crop", methods=["POST"])
def recommend_crop():
    """
    Predicts the optimal crop variant from all 105 choices using the new
    Spatio-Temporal Pipeline paired with strict biological guardrails.
    """
    try:
        data = request.json

        # 1. Dynamically map incoming calendar month to Tamil Nadu seasons
        month = data["Month"]
        if month in ['Jun', 'Jul', 'Aug', 'Sep']:
            season = 'Kuruvai/Sornavari'
        elif month in ['Oct', 'Nov', 'Dec']:
            season = 'Samba/Thaladi'
        else:
            season = 'Navarai/Kodai'

        # 2. Extract incoming numerical water parameter for the hard guardrail check
        rainfall = float(data["Rainfall_mm"])

        # 3. Format incoming json array exactly like your new pipeline feature space order
        input_df = pd.DataFrame([{
            "Year": int(data["Year"]),
            "Month": month,
            "Season": season,
            "District": data["District"],
            "Soil_PH_Low": float(data["Soil_PH_Low"]),
            "Soil_PH_High": float(data["Soil_PH_High"]),
            "Rainfall_mm": rainfall,
            "Max_Temp_C": float(data["Max_Temp_C"]),
            "Min_Temp_C": float(data["Min_Temp_C"])
        }])

        # 4. Predict complete probability array values across all 105 crops using the pipeline
        probabilities = crop_pipeline.predict_proba(input_df)[0]
        classes = crop_pipeline.classes_
        sorted_indices = np.argsort(probabilities)[::-1]

        # 5. Iterative validation filtering against biological guardrails
        recommended_crop = "SORGHUM"  # Default backup fallback if all rules fail
        for idx in sorted_indices:
            crop_string = classes[idx]

            # Hard Biological Guardrail: Reject wetland consumers if rainfall falls below 350mm
            if rainfall < 350.0 and crop_string in ['rice', 'sugarcane', 'jute']:
                continue  # Skip and try next highest probable model fit

            recommended_crop = crop_string
            break

        return jsonify({
            "success": True,
            "recommended_crop": recommended_crop.upper()
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/recommend-fertilizer", methods=["POST"])
def recommend_fertilizer():
    try:
        data = request.json
        input_df = pd.DataFrame([{
            "District_Name": data["District_Name"],
            "Soil_color": data["Soil_color"],
            "Nitrogen": data["Nitrogen"],
            "Phosphorus": data["Phosphorus"],
            "Potassium": data["Potassium"],
            "pH": data["pH"],
            "Rainfall": data["Rainfall"],
            "Temperature": data["Temperature"],
            "Crop": data["Crop"]
        }])
        prediction = fertilizer_model.predict(input_df)[0]
        return jsonify({
            "success": True,
            "recommended_fertilizer": prediction
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        data = request.json
        input_df = pd.DataFrame([{
            "State": data["State"],
            "Crop": data["Crop"],
            "Production": float(data["Production"]),
            "Yield": float(data["Yield"]),
            "Temperature": float(data["Temperature"]),
            "RainFall Annual": float(data["RainFall Annual"]),
            "CostCultivation": float(data["CostCultivation"])
        }])
        prediction = price_model.predict(input_df)
        return jsonify({
            "success": True,
            "predicted_price": round(float(prediction[0]), 2)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


if __name__ == "__main__":
    app.run(debug=True, port=5001)