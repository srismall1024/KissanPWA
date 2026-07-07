import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import YieldPrediction from "../components/YieldPrediction";
import CropRecommendation from "../components/CropRecommendation";
import FertilizerRecommendation from "../components/FertilizerRecommendation";
import PricePrediction from "../components/PricePrediction";
import FarmerOrders
from "../components/FarmerOrders";
import SalesHistory from "../components/SalesHistory";
import RevenueChart from "../components/RevenueChart";
import TopSellingCropsChart
from "../components/TopSellingCropsChart";
import RevenueOrdersTrendChart
from "../components/RevenueOrdersTrendChart";
import PaymentSettings
from "../components/PaymentSettings";
function FarmerDashboard() {

    const [cropData, setCropData] = useState({
        crop_name: "",
        category: "",
        quantity_kg: "",
        price_per_kg: "",
        description: "",
        image:null,
        location: ""
    });

    const [crops, setCrops] = useState([]);


    const [cropRevenue, setCropRevenue] =
    useState([]);

    const [
    topSellingCrops,
    setTopSellingCrops
] = useState([]);

    const [
    revenueOrdersTrend,
    setRevenueOrdersTrend
] = useState([]);

    const lowStockCrops = crops.filter(
    (crop) => Number(crop.quantity_kg) < 20
    );

    const [stats, setStats] = useState({

    revenue: 0,

    totalOrders: 0,

    lowStock: 0,

    monthlyRevenue: 0,

    bestSellingCrop: null,

    topBuyers: []

});

    const [editingCrop, setEditingCrop] =
    useState(null);

    const [newOrdersCount, setNewOrdersCount] =
useState(0);

    const totalCrops = crops.length;

    const totalQuantity = crops.reduce(
    (sum, crop) => sum + Number(crop.quantity_kg),
    0
    );

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

    const handleChange = (e) => {
        setCropData({
            ...cropData,
            [e.target.name]: e.target.value
        });
    };

    const fetchCrops = async () => {
    try {
        const res = await API.get("/crops/my-crops");
        setCrops(res.data.crops);
    } catch (err) {
        console.error(err);
    }
   };

    useEffect(() => {
        const loadCrops = async () => {
           try {
               const res = await API.get("/crops/my-crops");
               setCrops(res.data.crops);
            } catch (err) {
                console.error(err);
           }
       };

       const loadStats = async () => {

    const res =
        await API.get("/dashboard/farmer");

    console.log(res.data);

    setStats({
        revenue: res.data.revenue,
        totalOrders: res.data.totalOrders,
        lowStock: res.data.lowStock,
        monthlyRevenue: res.data.monthlyRevenue,
        bestSellingCrop: res.data.bestSellingCrop,
        topBuyers: res.data.topBuyers || []
    });

    const ordersRes =
    await API.get(
        "/orders/farmer/orders"
    );

const orders =
    ordersRes.data.orders;

const storedOrderId =
    sessionStorage.getItem(
        "lastSeenOrderId"
    );

if (
    !storedOrderId &&
    orders.length > 0
) {

    const newestOrderId =
        Math.max(
            ...orders.map(
                order => order.order_id
            )
        );

    sessionStorage.setItem(
        "lastSeenOrderId",
        newestOrderId
    );

    setNewOrdersCount(0);

} else {

    const lastSeenOrderId =
        Number(storedOrderId);

    const newOrders =
        orders.filter(
            order =>
                order.order_id >
                lastSeenOrderId
        );

    console.log(
    "Last Seen:",
    lastSeenOrderId
);

console.log(
    "New Orders:",
    newOrders
);

console.log(
    "Count:",
    newOrders.length
);

    setNewOrdersCount(
        newOrders.length
    );

    if (orders.length > 0) {

        const newestOrderId =
            Math.max(
                ...orders.map(
                    order => order.order_id
                )
            );

        sessionStorage.setItem(
            "lastSeenOrderId",
            newestOrderId
        );

    }

}


    const revenueRes =
        await API.get(
            "/dashboard/crop-revenue"
        );

    setCropRevenue(
        revenueRes.data.crops
    );


    const topCropRes =
    await API.get(
        "/dashboard/top-selling-crops"
    );

setTopSellingCrops(
    topCropRes.data.crops
);

const trendRes =
    await API.get(
        "/dashboard/revenue-orders-trend"
    );

setRevenueOrdersTrend(
    trendRes.data.data
);
};

       loadCrops();
       loadStats();
    }, []);

 useEffect(() => {

    const alreadyShown =
        sessionStorage.getItem(
            "lowStockPopupShown"
        );

    if (
        lowStockCrops.length > 0 &&
        !alreadyShown
    ) {

        alert(
            `⚠ Low Stock Alert\n\n${lowStockCrops
                .map(
                    crop =>
                        `${crop.crop_name} (${crop.quantity_kg} kg)`
                )
                .join("\n")}`
        );

        sessionStorage.setItem(
            "lowStockPopupShown",
            "true"
        );
    }

}, [lowStockCrops]);   


useEffect(() => {

    if (newOrdersCount > 0) {

        alert(
            `🛒 New Order Alert\n\n${newOrdersCount} new order(s) received`
        );

    }

}, [newOrdersCount]);

    const addCrop = async (e) => {
        e.preventDefault();

        try {
            const formData =
    new FormData();

formData.append(
    "crop_name",
    cropData.crop_name
);

formData.append(
    "category",
    cropData.category
);

formData.append(
    "quantity_kg",
    cropData.quantity_kg
);

formData.append(
    "price_per_kg",
    cropData.price_per_kg
);

formData.append(
    "description",
    cropData.description
);

formData.append(
    "location",
    cropData.location
);

formData.append(
    "image",
    cropData.image
);

await API.post(
    "/crops/add",
    formData,
    {
        headers: {
            "Content-Type":
                "multipart/form-data"
        }
    }
);

            alert("Crop Added Successfully");

            fetchCrops();

            setCropData({
                crop_name: "",
                category: "",
                quantity_kg: "",
                price_per_kg: "",
                description: "",
                image: null,
                location: ""
            });

        } catch (err) {
            console.error(err);
            alert("Failed to add crop");
        }
    };

    const deleteCrop = async (id) => {
        try {
            await API.delete(`/crops/${id}`);

            alert("Crop Deleted");

            fetchCrops();

        } catch (err) {
            console.error(err);
        }
    };

    const editCrop = (crop) => {

        setEditingCrop(crop);

        setCropData({
            crop_name: crop.crop_name,
            category: crop.category,
            quantity_kg: crop.quantity_kg,
            price_per_kg: crop.price_per_kg,
            description: crop.description,
            location: crop.location,
            image: null
        });
    }

    const updateCrop = async (e) => {

    e.preventDefault();

    try {

        const formData =
            new FormData();

        Object.keys(cropData).forEach((key) => {

            if (
                cropData[key] !== null
            ) {
                formData.append(
                    key,
                    cropData[key]
                );
            }
        });

        await API.put(
            `/crops/${editingCrop.crop_id}`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        alert("Crop Updated");

        setEditingCrop(null);

        fetchCrops();

    } catch (err) {

        console.error(err);

        alert("Update Failed");
    }
};



    return (
    <>
        <Navbar />

        <div className="container mt-4">

            <h1 className="mb-4">
                Farmer Dashboard
            </h1>

            <div className="mb-3 d-flex gap-2">

    <a
        href="http://localhost:8501"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success"
    >
        🌾 Open KissanRakshak AI
    </a>

    <Link
        to="/farmer-order-slips"
        className="btn btn-primary"
    >
        📄 Order Slips
    </Link>

    <Link
    to="/prediction"
    className="btn btn-warning"
>
    AI Prediction
</Link>

</div>

            <div className="row mb-4">

    <div className="col-lg-3">
        <YieldPrediction />
    </div>

    <div className="col-lg-3">
        <CropRecommendation />
    </div>

    <div className="col-lg-3">
        <FertilizerRecommendation />
    </div>

    <div className="col-lg-3">
        <PricePrediction />
    </div>

</div>

            <div className="row mb-4">

    <div className="col-md-4 mb-3">
        <div className="card text-bg-success shadow">
            <div className="card-body text-center">
                <h5>Total Crops</h5>
                <h2>{totalCrops}</h2>
            </div>
        </div>
    </div>

    <div className="col-md-4 mb-3">
        <div className="card text-bg-primary shadow">
            <div className="card-body text-center">
                <h5>Total Quantity</h5>
                <h2>{totalQuantity} kg</h2>
            </div>
        </div>
    </div>

    <div className="col-md-4 mb-3">
        <div className="card text-bg-warning shadow">
            <div className="card-body text-center">
                <h5>Average Price</h5>
                <h2>₹{averagePrice}</h2>
            </div>
        </div>
    </div>

    <div className="col-md-4 mb-3">
        <div className="card text-bg-info shadow">
            <div className="card-body text-center">
                <h5>Total Orders</h5>
                <h2>{stats.totalOrders}</h2>
            </div>
        </div>
    </div>

    <div className="col-md-4 mb-3">
    <div className="card text-bg-secondary shadow">
        <div className="card-body text-center">
            <h5>Monthly Revenue</h5>
            <h2>₹{stats.monthlyRevenue}</h2>
        </div>
    </div>
</div>

    <div className="col-md-4 mb-3">
        <div className="card text-bg-dark shadow">
            <div className="card-body text-center">
                <h5>Total Revenue</h5>
                <h2>₹{stats.revenue}</h2>
            </div>
        </div>
    </div>

    <div className="col-md-4 mb-3">
        <div className="card text-bg-danger shadow">
            <div className="card-body text-center">
                <h5>Low Stock Crops</h5>
                <h2>{stats.lowStock}</h2>
            </div>
        </div>
    </div>

</div>

{
    stats.bestSellingCrop && (

        <div className="card shadow mb-4">

            <div className="card-header bg-success text-white">

                Best Selling Crop

            </div>

            <div className="card-body">

                <h4>
                    🥇 {stats.bestSellingCrop.crop_name}
                </h4>

                <p>
                    Sold:
                    {" "}
                    {stats.bestSellingCrop.sold_qty}
                    {" "}
                    kg
                </p>

                <p>
                    Revenue:
                    ₹
                    {stats.bestSellingCrop.revenue}
                </p>

            </div>

        </div>

    )
}

{lowStockCrops.length > 0 && (

    <div className="alert alert-warning mb-4">

        <h5>
            ⚠ Low Stock Alert
        </h5>

        {lowStockCrops.map((crop) => (

            <div key={crop.crop_id}>

                <strong>
                    {crop.crop_name}
                </strong>

                {" "}-
                {" "}

                {crop.quantity_kg} kg remaining

            </div>

        ))}

    </div>

)}

<RevenueChart />

<RevenueOrdersTrendChart
    data={revenueOrdersTrend}
/>

<TopSellingCropsChart
    data={topSellingCrops}
/>

<div className="card shadow mb-4">

    <div className="card-header bg-success text-white">
        Crop Revenue Breakdown
    </div>

    <div className="card-body">

        <table className="table">

            <thead>

                <tr>
                    <th>Crop</th>
                    <th>Sold Qty</th>
                    <th>Revenue</th>
                </tr>

            </thead>

            <tbody>

                {cropRevenue.map((crop) => (

                    <tr key={crop.crop_name}>

                        <td>{crop.crop_name}</td>

                        <td>
                            {crop.sold_qty} kg
                        </td>

                        <td>
                            ₹{crop.revenue}
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>

            <div className="card shadow mb-4">

                <div className="card-header bg-success text-white">
                    {
editingCrop
    ? "Edit Crop"
    : "Add Crop"
}
                </div>

                <div className="card-body">

                    <form onSubmit={editingCrop ? updateCrop : addCrop}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <input
                                    name="crop_name"
                                    placeholder="Crop Name"
                                    value={cropData.crop_name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <input
                                    name="category"
                                    placeholder="Category"
                                    value={cropData.category}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <input
                                    name="quantity_kg"
                                    placeholder="Quantity (kg)"
                                    value={cropData.quantity_kg}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <input
                                    name="price_per_kg"
                                    placeholder="Price Per Kg"
                                    value={cropData.price_per_kg}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <input
                                    name="location"
                                    placeholder="Location"
                                    value={cropData.location}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={cropData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                />
                            </div>

                            <div className="col-md-12 mb-3">

    <input
        type="file"
        accept="image/*"
        className="form-control"
        onChange={(e) =>
            setCropData({
                ...cropData,
                image:
                    e.target.files[0]
            })
        }
    />

</div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            {editingCrop ? "Update Crop" : "Add Crop"}
                        </button>

                    </form>

                </div>

            </div>

            <h2 className="mb-3">
                Available Crops
            </h2>

            <div className="row">

                {crops.map((crop) => (

                    <div
                        className="col-md-4 mb-4"
                        key={crop.crop_id}
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

                                <h5 className="card-title">
                                    {crop.crop_name}
                                </h5>

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
                                    ₹{crop.price_per_kg}
                                </p>

                                <p>
                                    <strong>Location:</strong>
                                    {" "}
                                    {crop.location}
                                </p>

                                <div className="d-flex gap-2">

    <button
        className="btn btn-warning"
        onClick={() =>
            editCrop(crop)
        }
    >
        Edit
    </button>

    <button
        className="btn btn-danger"
        onClick={() =>
            deleteCrop(
                crop.crop_id
            )
        }
    >
        Delete
    </button>

</div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="card shadow mb-4">

    <div className="card-header bg-dark text-white">

        Top 5 Buyers

    </div>

    <div className="card-body">

        <table className="table table-bordered">

            <thead>

                <tr>

                    <th>Buyer</th>

                    <th>Total Orders</th>

                    <th>Total Spent</th>

                </tr>

            </thead>

            <tbody>

                {stats.topBuyers?.map(
                    (buyer, index) => (

                    <tr key={index}>

                        <td>
                            {buyer.full_name}
                        </td>

                        <td>
                            {buyer.total_orders}
                        </td>

                        <td>
                            ₹{buyer.total_spent}
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    </div>

</div>

            {/* Farmer Orders */}
            <FarmerOrders />

            

{/* Top Selling Crops */}
<TopSellingCropsChart
    data={topSellingCrops}
/>

            <SalesHistory />

            <PaymentSettings />

        </div>
    </>
);
}

export default FarmerDashboard;