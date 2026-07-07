import { useState } from "react";
import axios from "axios";

function PricePrediction() {

    const [formData, setFormData] = useState({
        State: "",
        Crop: "",
        Production: "",
        Yield: "",
        Temperature: "",
        RainFallAnnual: "",
        CostCultivation: ""
    });

    const [predictedPrice, setPredictedPrice] =
        useState(null);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://127.0.0.1:5001/predict-price",
                {
                    State: formData.State,
                    Crop: formData.Crop,
                    Production:
                        Number(formData.Production),
                    Yield:
                        Number(formData.Yield),
                    Temperature:
                        Number(formData.Temperature),
                    "RainFall Annual":
                        Number(formData.RainFallAnnual),
                    CostCultivation:
                        Number(formData.CostCultivation)
                }
            );

            setPredictedPrice(
                response.data.predicted_price
            );

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header bg-info text-white">
                AI Price Prediction
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-2"
                        name="State"
                        placeholder="State"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Crop"
                        placeholder="Crop"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Production"
                        placeholder="Production"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Yield"
                        placeholder="Yield"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Temperature"
                        placeholder="Temperature"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="RainFallAnnual"
                        placeholder="Rainfall Annual"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-3"
                        name="CostCultivation"
                        placeholder="Cost of Cultivation"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="btn btn-info"
                    >
                        Predict Price
                    </button>

                </form>

                {predictedPrice && (

                    <div className="alert alert-success mt-3">

                        Predicted Price:

                        <strong>
                            {" "}
                            ₹{predictedPrice}
                        </strong>

                    </div>

                )}

            </div>

        </div>

    );
}

export default PricePrediction;