import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Prediction() {

    const [loading, setLoading] = useState(false);

    const [cropData, setCropData] = useState({
        District_Name: "",
        Soil_color: "",
        Nitrogen: "",
        Phosphorus: "",
        Potassium: "",
        pH: "",
        Rainfall: "",
        Temperature: ""
    });

    const [fertilizerData, setFertilizerData] = useState({
        District_Name: "",
        Soil_color: "",
        Nitrogen: "",
        Phosphorus: "",
        Potassium: "",
        pH: "",
        Rainfall: "",
        Temperature: "",
        Crop: ""
    });

    const [priceData, setPriceData] = useState({
        State: "",
        Crop: "",
        Production: "",
        Yield: "",
        Temperature: "",
        "RainFall Annual": "",
        CostCultivation: ""
    });

    const [cropResult, setCropResult] = useState("");
    const [fertilizerResult, setFertilizerResult] = useState("");
    const [priceResult, setPriceResult] = useState("");

    const handleCropPrediction = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                "http://localhost:5002/recommend-crop",
                cropData
            );

            setCropResult(
                res.data.recommended_crop
            );

        } catch (err) {

            console.error(err);
            alert("Crop Prediction Failed");

        } finally {

            setLoading(false);

        }
    };

    const handleFertilizerPrediction = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                "http://localhost:5002/recommend-fertilizer",
                fertilizerData
            );

            setFertilizerResult(
                res.data.recommended_fertilizer
            );

        } catch (err) {

            console.error(err);
            alert("Fertilizer Prediction Failed");

        } finally {

            setLoading(false);

        }
    };

    const handlePricePrediction = async () => {

        try {

            setLoading(true);

            const res = await axios.post(
                "http://localhost:5002/predict-price",
                priceData
            );

            setPriceResult(
                res.data.predicted_price
            );

        } catch (err) {

            console.error(err);
            alert("Price Prediction Failed");

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2 className="fw-bold mb-4 text-center">
                    AI Prediction Center
                </h2>

                <div className="row">

                    {/* Crop Recommendation */}

                    <div className="col-lg-4 mb-4">

                        <div className="card shadow h-100">

                            <div className="card-header bg-success text-white fw-bold">
                                🌱 Crop Recommendation
                            </div>

                            <div className="card-body">

                                <input
                                    className="form-control mb-2"
                                    placeholder="District Name"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            District_Name: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Soil Color"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Soil_color: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Nitrogen"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Nitrogen: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Phosphorus"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Phosphorus: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Potassium"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Potassium: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="pH"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            pH: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Rainfall"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Rainfall: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Temperature"
                                    type="number"
                                    onChange={(e) =>
                                        setCropData({
                                            ...cropData,
                                            Temperature: e.target.value
                                        })
                                    }
                                />

                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleCropPrediction}
                                >
                                    Recommend Crop
                                </button>

                                {cropResult && (
                                    <div className="alert alert-success mt-3">
                                        Recommended Crop:
                                        <strong> {cropResult}</strong>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* Fertilizer Recommendation */}

                    <div className="col-lg-4 mb-4">

                        <div className="card shadow h-100">

                            <div className="card-header bg-warning fw-bold">
                                🧪 Fertilizer Recommendation
                            </div>

                            <div className="card-body">

    <input
        className="form-control mb-2"
        placeholder="District Name"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                District_Name: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Soil Color"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Soil_color: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Nitrogen"
        type="number"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Nitrogen: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Phosphorus"
        type="number"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Phosphorus: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Potassium"
        type="number"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Potassium: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="pH"
        type="number"
        step="0.1"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                pH: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Rainfall"
        type="number"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Rainfall: e.target.value
            })
        }
    />

    <input
        className="form-control mb-2"
        placeholder="Temperature"
        type="number"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Temperature: e.target.value
            })
        }
    />

    <input
        className="form-control mb-3"
        placeholder="Crop"
        onChange={(e) =>
            setFertilizerData({
                ...fertilizerData,
                Crop: e.target.value
            })
        }
    />

    <button
        className="btn btn-warning w-100"
        onClick={handleFertilizerPrediction}
    >
        Recommend Fertilizer
    </button>

    {
        fertilizerResult &&
        (
            <div className="alert alert-success mt-3">
                Recommended Fertilizer:
                <strong> {fertilizerResult}</strong>
            </div>
        )
    }

</div>

                        </div>

                    </div>

                    {/* Price Prediction */}

                    <div className="col-lg-4 mb-4">

                        <div className="card shadow h-100">

                            <div className="card-header bg-info text-white fw-bold">
                                💰 Price Prediction
                            </div>

                            <div className="card-body">

                                <input
                                    className="form-control mb-2"
                                    placeholder="State"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            State: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Crop"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            Crop: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Production"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            Production: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Yield"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            Yield: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Temperature"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            Temperature: e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-2"
                                    placeholder="Rainfall Annual"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            "RainFall Annual": e.target.value
                                        })
                                    }
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Cost of Cultivation"
                                    onChange={(e) =>
                                        setPriceData({
                                            ...priceData,
                                            CostCultivation: e.target.value
                                        })
                                    }
                                />

                                <button
                                    className="btn btn-info text-white w-100"
                                    onClick={handlePricePrediction}
                                >
                                    Predict Price
                                </button>

                                {priceResult && (
                                    <div className="alert alert-success mt-3">
                                        Predicted Price:
                                        <strong> ₹{priceResult}</strong>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {loading && (
                    <div className="text-center mt-3">
                        <div
                            className="spinner-border text-success"
                            role="status"
                        />
                    </div>
                )}

            </div>
        </>
    );
}

export default Prediction;