import { useState } from "react";
import axios from "axios";

function FertilizerRecommendation() {

    const [formData, setFormData] = useState({
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

    const [recommendedFertilizer,
        setRecommendedFertilizer] = useState("");

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
                "http://127.0.0.1:5001/recommend-fertilizer",
                {
                    District_Name:
                        formData.District_Name,

                    Soil_color:
                        formData.Soil_color,

                    Nitrogen:
                        Number(formData.Nitrogen),

                    Phosphorus:
                        Number(formData.Phosphorus),

                    Potassium:
                        Number(formData.Potassium),

                    pH:
                        Number(formData.pH),

                    Rainfall:
                        Number(formData.Rainfall),

                    Temperature:
                        Number(formData.Temperature),

                    Crop:
                        formData.Crop
                }
            );

            setRecommendedFertilizer(
                response.data.recommended_fertilizer
            );

        } catch (err) {

            console.error(err);

        }

    };

    return (
        <div className="card shadow mb-4">

            <div className="card-header bg-warning text-dark">
                AI Fertilizer Recommendation
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-2"
                        name="District_Name"
                        placeholder="District"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Soil_color"
                        placeholder="Soil Color"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Nitrogen"
                        placeholder="Nitrogen"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Phosphorus"
                        placeholder="Phosphorus"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Potassium"
                        placeholder="Potassium"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="pH"
                        placeholder="pH"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Rainfall"
                        placeholder="Rainfall"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-2"
                        name="Temperature"
                        placeholder="Temperature"
                        onChange={handleChange}
                    />

                    <input
                        className="form-control mb-3"
                        name="Crop"
                        placeholder="Crop"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="btn btn-warning"
                    >
                        Recommend Fertilizer
                    </button>

                </form>

                {recommendedFertilizer && (

                    <div className="alert alert-success mt-3">

                        Recommended Fertilizer:

                        <strong>
                            {" "}
                            {recommendedFertilizer}
                        </strong>

                    </div>

                )}

            </div>

        </div>
    );
}

export default FertilizerRecommendation;