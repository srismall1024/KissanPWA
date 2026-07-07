import { useState } from "react";
import axios from "axios";

function YieldPrediction() {

    const [formData, setFormData] = useState({
        region: "",
        crop_type: "",
        soil_moisture: "",
        soil_pH: "",
        temperature: "",
        rainfall: "",
        humidity: "",
        sunlight_hours: ""
    });

    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const predictYield = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
    "http://localhost:5001/predict-yield",
    {
        region: formData.region,
        crop_type: formData.crop_type,

        "soil_moisture_%": Number(formData.soil_moisture),

        soil_pH: Number(formData.soil_pH),

        temperature_C: Number(formData.temperature),

        rainfall_mm: Number(formData.rainfall),

        "humidity_%": Number(formData.humidity),

        sunlight_hours: Number(formData.sunlight_hours),

        irrigation_type: "Drip",
        fertilizer_type: "Organic",
        pesticide_usage_ml: 50,
        total_days: 120,
        latitude: 12.9,
        longitude: 80.2,
        NDVI_index: 0.75,
        sowing_date: "2024-01-01",
        harvest_date: "2024-05-01",
        sensor_id: "S001",
        timestamp: "2024-01-15",
        crop_disease_status: "Healthy"
    }
);

            setPrediction(
                response.data.predicted_yield
            );

        } catch (err) {

            console.error(err);

            alert(
                "Prediction Failed"
            );
        }
    };

    return (
        <div className="card shadow mb-4">

            <div className="card-header bg-primary text-white">
                AI Yield Prediction
            </div>

            <div className="card-body">

                <form onSubmit={predictYield}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="region"
                                placeholder="Region"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="crop_type"
                                placeholder="Crop Type"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="soil_moisture"
                                placeholder="Soil Moisture (%)"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="soil_pH"
                                placeholder="Soil pH"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="temperature"
                                placeholder="Temperature °C"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="rainfall"
                                placeholder="Rainfall (mm)"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="humidity"
                                placeholder="Humidity (%)"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                name="sunlight_hours"
                                placeholder="Sunlight Hours"
                                className="form-control"
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Predict Yield
                    </button>

                </form>

                {prediction && (

                    <div className="alert alert-success mt-4">

                        <h5>
                            Predicted Yield:
                        </h5>

                        <h3>
                            {prediction} kg/hectare
                        </h3>

                    </div>

                )}

            </div>

        </div>
    );
}

export default YieldPrediction;