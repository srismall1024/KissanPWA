import { useState } from "react";
import axios from "axios";

function CropRecommendation() {
    const [formData, setFormData] = useState({
        Year: new Date().getFullYear().toString(), // Defaults to current year (e.g., 2026)
        Month: "",
        District: "",
        Soil_PH_Low: "",
        Soil_PH_High: "",
        Rainfall_mm: "",
        Max_Temp_C: "",
        Min_Temp_C: ""
    });

    const [recommendedCrop, setRecommendedCrop] = useState("");

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
                "http://127.0.0.1:5001/recommend-crop",
                {
                    Year: Number(formData.Year),
                    Month: formData.Month, // e.g., "Jun"
                    District: formData.District.toUpperCase(), // e.g., "TANJORE"
                    Soil_PH_Low: Number(formData.Soil_PH_Low),
                    Soil_PH_High: Number(formData.Soil_PH_High),
                    Rainfall_mm: Number(formData.Rainfall_mm),
                    Max_Temp_C: Number(formData.Max_Temp_C),
                    Min_Temp_C: Number(formData.Min_Temp_C)
                }
            );

            setRecommendedCrop(response.data.recommended_crop);
        } catch (err) {
            console.error("Error fetching recommendation:", err);
        }
    };

    return (
        <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
                AI Dynamic Crop Recommendation
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <input
                        className="form-control mb-2"
                        type="number"
                        name="Year"
                        value={formData.Year}
                        placeholder="Year (e.g., 2026)"
                        onChange={handleChange}
                        required
                    />

                    {/* Month Selection Dropdown to avoid spelling mismatches */}
                    <select
                        className="form-control mb-2"
                        name="Month"
                        onChange={handleChange}
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Select Month</option>
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>

                    <input
                        className="form-control mb-2"
                        type="text"
                        name="District"
                        placeholder="District Name (e.g., TANJORE)"
                        onChange={handleChange}
                        required
                    />

                    <div className="row mb-2">
                        <div className="col">
                            <input
                                className="form-control"
                                type="number"
                                step="0.1"
                                name="Soil_PH_Low"
                                placeholder="Soil pH Low Bound"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <input
                                className="form-control"
                                type="number"
                                step="0.1"
                                name="Soil_PH_High"
                                placeholder="Soil pH High Bound"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <input
                        className="form-control mb-2"
                        type="number"
                        step="0.01"
                        name="Rainfall_mm"
                        placeholder="Rainfall (mm)"
                        onChange={handleChange}
                        required
                    />

                    <div className="row mb-3">
                        <div className="col">
                            <input
                                className="form-control"
                                type="number"
                                step="0.1"
                                name="Max_Temp_C"
                                placeholder="Max Temp (°C)"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col">
                            <input
                                className="form-control"
                                type="number"
                                step="0.1"
                                name="Min_Temp_C"
                                placeholder="Min Temp (°C)"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Recommend Crop
                    </button>
                </form>

                {recommendedCrop && (
                    <div className="alert alert-success mt-3 text-center">
                        Recommended Crop: <strong>{recommendedCrop}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CropRecommendation;