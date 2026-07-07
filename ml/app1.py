from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Initialize the Flask application and enable CORS for local cross-origin frontend requests
app = Flask(__name__)
CORS(app)

# Load trained models locally from the 'models' directory
crop_model = joblib.load("models/crop_model.pkl")
fertilizer_model = joblib.load("models/fertilizer_model.pkl")
price_model = joblib.load("models/price_model.pkl")

@app.route("/")
def home():
    return "KissanPWA offline Prediction API Running"


    
@app.route("/recommend-crop", methods=["POST"])
def recommend_crop():
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
            "Temperature": data["Temperature"]
        }])

        prediction = crop_model.predict(input_df)[0]

        return jsonify({
            "success": True,
            "recommended_crop": prediction
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })
    
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
        return jsonify({
            "success": False,
            "error": str(e)
        })
    
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
        return jsonify({
            "success": False,
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True, port=5002)