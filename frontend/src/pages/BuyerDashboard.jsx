import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import MyOrders from "../components/MyOrders";
import ComplaintHistory
from "../components/ComplaintHistory";
import MyInvoices
from "../components/MyInvoices";
import InvoiceHistory
from "../components/InvoiceHistory";
function BuyerDashboard() {

    const navigate = useNavigate();

    const [crops, setCrops] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const [selectedCrop, setSelectedCrop] = useState(null);

    const [orderQuantity, setOrderQuantity] =useState("");

    const [showOrderForm, setShowOrderForm] =useState(false);

    const totalStock = crops.reduce(
        (sum, crop) => sum + Number(crop.quantity_kg),
        0
    );

    const totalCrops = crops.length;

    const averagePrice =
        crops.length > 0
            ? (
                  crops.reduce(
                      (sum, crop) =>
                          sum + Number(crop.price_per_kg),
                      0
                  ) / crops.length
              ).toFixed(2)
            : 0;

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await API.get("/crops");
                setCrops(res.data.crops);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCrops();
    }, []);

    
    const placeOrder = (crop) => {

    setSelectedCrop(crop);

    setOrderQuantity("");

    setShowOrderForm(true);
    };

    const confirmOrder = () => {

    navigate(
        "/payment",
        {
            state: {
                crop: selectedCrop,
                quantity:
                    Number(orderQuantity),
                totalAmount:
                    Number(orderQuantity) *
                    Number(
                        selectedCrop.price_per_kg
                    )
            }
        }
    );

};

  

    const filteredCrops = crops
        .filter((crop) =>
            crop.crop_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .filter((crop) =>
            selectedCategory
                ? crop.category === selectedCategory
                : true
        )
        .filter((crop) =>
            selectedLocation
                ? crop.location === selectedLocation
                : true
        )
        .sort((a, b) => {
            if (sortOrder === "low-high") {
                return a.price_per_kg - b.price_per_kg;
            }

            if (sortOrder === "high-low") {
                return b.price_per_kg - a.price_per_kg;
            }

            return 0;
        });

    return (
    <>
        <Navbar />

        <div className="container mt-4">

            <h1 className="mb-4">
                Buyer Dashboard
            </h1>

            <div className="mb-3">

    <a
        href="http://localhost:8501"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success"
    >
        🌾 Open KissanRakshak AI
    </a>

</div>

            {/* Statistics Cards */}
            <div className="row mb-4">

                <div className="col-md-4">
                    <div className="card text-bg-success shadow">
                        <div className="card-body text-center">
                            <h5>Available Crops</h5>
                            <h2>{totalCrops}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-bg-primary shadow">
                        <div className="card-body text-center">
                            <h5>Total Stock</h5>
                            <h2>{totalStock} kg</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-bg-warning shadow">
                        <div className="card-body text-center">
                            <h5>Average Price</h5>
                            <h2>₹{averagePrice}</h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* Search & Filters */}
            <div className="card shadow mb-4">

                <div className="card-header bg-dark text-white">
                    Search & Filters
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Crop"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {[...new Set(
                                    crops.map(
                                        (crop) =>
                                            crop.category
                                    )
                                )].map((category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={selectedLocation}
                                onChange={(e) =>
                                    setSelectedLocation(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    All Locations
                                </option>

                                {[...new Set(
                                    crops.map(
                                        (crop) =>
                                            crop.location
                                    )
                                )].map((location) => (

                                    <option
                                        key={location}
                                        value={location}
                                    >
                                        {location}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Sort By Price
                                </option>

                                <option value="low-high">
                                    Low → High
                                </option>

                                <option value="high-low">
                                    High → Low
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {
showOrderForm &&
selectedCrop && (

<div className="card shadow mb-4">

    <div className="card-header bg-primary text-white">

        Place Order

    </div>

    <div className="card-body">

        <h5>
            {selectedCrop.crop_name}
        </h5>

        <p>
            Price:
            ₹{selectedCrop.price_per_kg}/kg
        </p>

        <div className="mb-3">

            <label className="form-label">
                Quantity (kg)
            </label>

            <input
                type="number"
                className="form-control"
                value={orderQuantity}
                onChange={(e) =>
                    setOrderQuantity(
                        e.target.value
                    )
                }
            />

        </div>

        <h5>

            Total Price: ₹

            {
                orderQuantity
                ?
                (
                    Number(orderQuantity)
                    *
                    Number(
                        selectedCrop.price_per_kg
                    )
                )
                :
                0
            }

        </h5>

        <button
            className="btn btn-success me-2"
            onClick={confirmOrder}
        >
            Confirm Order
        </button>

        <button
            className="btn btn-secondary"
            onClick={() =>
                setShowOrderForm(false)
            }
        >
            Cancel
        </button>

    </div>

</div>

)}

            {/* Crop Cards */}
            <div className="row">

                {filteredCrops.map((crop) => (

                    <div
                        key={crop.crop_id}
                        className="col-md-4 mb-4"
                    >

                        <div className="card shadow h-100">

                            <div className="card-body">

                                {crop.image_url && (

            <img
                src={`http://localhost:5000${crop.image_url}`}
                alt={crop.crop_name}
                className="img-fluid rounded mb-3"
                style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover"
                }}
            />

        )}

                                <h4 className="card-title text-success">
                                    {crop.crop_name}
                                </h4>

                                <hr />

                                <p>
                                    <strong>Category:</strong>
                                    {" "}
                                    {crop.category}
                                </p>

                                <p>
                                    <strong>Quantity:</strong>
                                    {" "}
                                    {crop.quantity_kg} kg
                                </p>

                                <p>
                                    <strong>Price:</strong>
                                    {" "}
                                    ₹{crop.price_per_kg}/kg
                                </p>

                                <p>
                                    <strong>Location:</strong>
                                    {" "}
                                    {crop.location}
                                </p>

                                <button
    className="btn btn-primary w-100"
    onClick={() =>
        placeOrder(crop)
    }
>
    Place Order
</button>


                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {/* My Orders */}
            <MyOrders />

            <MyInvoices />

            <InvoiceHistory />

            <ComplaintHistory />

        </div>
    </>
);
}

export default BuyerDashboard;