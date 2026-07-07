import { useEffect, useState, useCallback } from "react";

import { useRef } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import AnalyticsCharts from "../components/AnalyticsCharts";

import AdminDashboardCards

from "../components/AdminDashboardCards";

import FarmerEarningsChart
from "../components/FarmerEarningsChart";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
    exportProfessionalReport
}
from "../utils/exportProfessionalReport";

function AdminDashboard() {

    const adminDashboardRef = useRef();

    const revenueChartRef = useRef(null);

const farmerChartRef = useRef(null);

const cropChartRef = useRef(null);

    const [users, setUsers] = useState([]);

    const [crops, setCrops] = useState([]);

    const [orders, setOrders] = useState([]);

    const [complaints, setComplaints] = useState([]);

    const [topCrops, setTopCrops] = useState([]);

    const [topFarmers, setTopFarmers] = useState([]);

    const [revenueTrend, setRevenueTrend] = useState([]);

    const [monthlySales,
setMonthlySales] =
useState([]);

    const [kpiMetrics, setKpiMetrics] =
    useState({});

    const [categoryRevenue,
    setCategoryRevenue] =
    useState([]);

    const [topBuyers,
    setTopBuyers] =
    useState([]);

    

    const totalUsers = users.length;



    const totalFarmers = users.filter(

    (user) => user.role === "farmer"

    ).length;



    const totalBuyers = users.filter(

    (user) =>

        user.role === "buyer"

    ).length;

    const totalCrops = crops.length;

    const openComplaints = complaints.filter(
    (complaint) =>
        complaint.status === "Open" ||
        complaint.status === "Pending"
).length;

    const stats = {
    totalRevenue: kpiMetrics.revenue || 0,
    totalOnline: kpiMetrics.online || 0,
    codPending: kpiMetrics.pending || 0,
    totalOrders: kpiMetrics.orders || 0
};

    const fetchData = useCallback(async () => {

        try {



            const usersRes = await API.get("/admin/users");

            const cropsRes = await API.get("/admin/crops");

            const ordersRes = await API.get("/admin/orders");

            const complaintsRes = await API.get("/admin/complaints");



            setUsers(usersRes.data.users);

            setCrops(cropsRes.data.crops);

            setOrders(ordersRes.data.orders);

            setComplaints(complaintsRes.data.complaints);



        } catch (err) {

            console.error(err);

        }

    }, []);



    useEffect(() => {

        const loadData = async () => {

            await fetchData();

        };



        loadData();



        const loadAnalytics = async () => {



    try {


        const crops =

            await API.get(

                "/admin/top-crops"

            );



        const farmers =

            await API.get(

                "/admin/top-farmers"

            );



        const trend =

            await API.get(

                "/admin/revenue-trend"

            );

        const sales =
    await API.get(
        "/admin/monthly-sales"
    );

        const kpi =
    await API.get(
        "/admin/kpi-metrics"
    );

    const categoryRes =
    await API.get(
        "/admin/category-revenue"
    );

    const buyersRes =
    await API.get(
        "/admin/top-buyers"
    );

setMonthlySales(
    sales.data.sales
);



        setTopCrops(

            crops.data.crops

        );



        setTopFarmers(

            farmers.data.farmers

        );



        setRevenueTrend(

            trend.data.trend

        );

        setKpiMetrics(
    kpi.data.metrics
);

        setCategoryRevenue(
    categoryRes.data.categories
);

    setTopBuyers(
    buyersRes.data.buyers
);


    } catch (err) {



        console.error(err);



    }



};



loadAnalytics();

    }, [fetchData]);

   



    // Update Order Status

    const updateOrderStatus = async (orderId, status) => {

        try {

            await API.put(

                `/orders/${orderId}/status`,

                { status }

            );



            alert("Order Status Updated");



            fetchData();



        } catch (err) {

            console.error(err);

        }

    };



    // Update Complaint Status

    const updateComplaintStatus = async (

        complaintId,

        status

    ) => {

        try {



            await API.put(

                `/complaints/${complaintId}/status`,

                { status }

            );



            alert("Complaint Status Updated");



            fetchData();



        } catch (err) {

            console.error(err);

        }

    };

    const exportAnalytics = () => {

    // Sheet 1
    const kpiData = [

        {
            Metric: "Total Revenue",
            Value: kpiMetrics.revenue
        },

        {
            Metric: "Total Orders",
            Value: kpiMetrics.orders
        },

        {
            Metric: "COD Pending",
            Value: kpiMetrics.pending
        },

        {
            Metric: "Total Users",
            Value: totalUsers
        },

        {
            Metric: "Total Farmers",
            Value: totalFarmers
        },

        {
            Metric: "Total Buyers",
            Value: totalBuyers
        }

    ];

    const workbook =
        XLSX.utils.book_new();

    // KPI Sheet

    const kpiSheet =
        XLSX.utils.json_to_sheet(
            kpiData
        );

    XLSX.utils.book_append_sheet(
        workbook,
        kpiSheet,
        "Dashboard KPIs"
    );

    // Top Crops Sheet

    const cropSheet =
        XLSX.utils.json_to_sheet(
            topCrops
        );

    XLSX.utils.book_append_sheet(
        workbook,
        cropSheet,
        "Top Crops"
    );

    // Top Farmers Sheet

    const farmerSheet =
        XLSX.utils.json_to_sheet(
            topFarmers
        );

    XLSX.utils.book_append_sheet(
        workbook,
        farmerSheet,
        "Top Farmers"
    );

    // Revenue Trend Sheet

    const trendSheet =
        XLSX.utils.json_to_sheet(
            revenueTrend
        );

    XLSX.utils.book_append_sheet(
        workbook,
        trendSheet,
        "Revenue Trend"
    );

    const excelBuffer =
        XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

    const fileData =
        new Blob(
            [excelBuffer],
            {
                type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

    saveAs(
        fileData,
        `KissanPWA_Analytics_${new Date()
            .toISOString()
            .split("T")[0]}.xlsx`
    );
};

const exportPDFReport = async () => {

    const input = adminDashboardRef.current;

    const canvas =
        await html2canvas(input);

    const imgData =
        canvas.toDataURL("image/png");

    const pdf =
        new jsPDF(
            "p",
            "mm",
            "a4"
        );

    const pdfWidth =
        pdf.internal.pageSize.getWidth();

    const pdfHeight =
        (canvas.height * pdfWidth)
        / canvas.width;

    pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
    );

    pdf.save(
        `KissanPWA_Analytics_${new Date()
            .toISOString()
            .split("T")[0]}.pdf`
    );
};



    return (

    <>

        <Navbar />



        <div className="container mt-4">



            <h1 className="mb-4">

    Operator Dashboard

    {
        openComplaints > 0 &&
        (
            <span className="badge bg-danger ms-3">
                {openComplaints} New Complaints
            </span>
        )
    }

</h1>



            <div className="row mb-4">



    <div className="col-md-2 mb-3">

        <div className="card text-bg-primary shadow">

            <div className="card-body text-center">

                <h6>Total Users</h6>

                <h2>{totalUsers}</h2>

            </div>

        </div>

    </div>



    <div className="col-md-2 mb-3">

        <div className="card text-bg-success shadow">

            <div className="card-body text-center">

                <h6>Farmers</h6>

                <h2>{totalFarmers}</h2>

            </div>

        </div>

    </div>



    <div className="col-md-2 mb-3">

        <div className="card text-bg-info shadow">

            <div className="card-body text-center">

                <h6>Buyers</h6>

                <h2>{totalBuyers}</h2>

            </div>

        </div>

    </div>



    <div className="col-md-2 mb-3">

        <div className="card text-bg-warning shadow">

            <div className="card-body text-center">

                <h6>Total Crops</h6>

                <h2>{totalCrops}</h2>

            </div>

        </div>

    </div>




    <div className="col-md-2 mb-3">

        <div className="card text-bg-danger shadow">

            <div className="card-body text-center">

                <h6>Complaints</h6>

                <h2>{openComplaints}</h2>

            </div>

        </div>

    </div>


</div>

<div className="row mt-4">

    <div className="col-md-4">

        <div className="card shadow border-success">

            <div className="card-body">

                <h6>Total Revenue</h6>

                <h3>
                    ₹{kpiMetrics.revenue}
                </h3>

                <span className="text-success">

                    ↑ Revenue Growing

                </span>

            </div>

        </div>

    </div>

    <div className="col-md-4">

        <div className="card shadow border-primary">

            <div className="card-body">

                <h6>Total Orders</h6>

                <h3>
                    {kpiMetrics.orders}
                </h3>

                <span className="text-primary">

                    ↑ Orders Increasing

                </span>

            </div>

        </div>

    </div>

    <div className="col-md-4">

        <div className="card shadow border-warning">

            <div className="card-body">

                <h6>COD Pending</h6>

                <h3>
                    ₹{kpiMetrics.pending}
                </h3>

                <span className="text-danger">

                    ↓ Needs Collection

                </span>

            </div>

        </div>

    </div>

</div>

<div className="mb-3">

    <button
        className="btn btn-success"
        onClick={exportAnalytics}
    >

        Export Analytics Report

    </button>

    <button
    className="btn btn-danger ms-2"
    onClick={exportPDFReport}
>
    Export PDF Report
</button>

<button
    className="btn btn-dark ms-2"
    onClick={() =>
        exportProfessionalReport(
            stats,
            topCrops,
            topFarmers,
            revenueChartRef,
            farmerChartRef,
            cropChartRef
        )
    }
>
    Professional PDF Report
</button>

<button
    className="btn btn-primary ms-2"
    onClick={() =>
        window.location.href =
        "/operator-order-slips"
    }
>
    Order Slips
</button>

</div>

<div ref={adminDashboardRef}>

<AdminDashboardCards />


<AnalyticsCharts
    users={users}
    orders={orders}
    complaints={complaints}
    crops={crops}
    revenueTrend={revenueTrend}
    topFarmers={topFarmers}
    topBuyers={topBuyers}
    revenueChartRef={revenueChartRef}
    farmerChartRef={farmerChartRef}
    cropChartRef={cropChartRef}
    categoryRevenue={categoryRevenue}
/>

</div>


<h4 className="mt-4">Top Selling Crops</h4>

<ul>
  {topCrops.map((crop) => (
    <li key={crop.crop_name}>
      {crop.crop_name} - {crop.total_sold} kg
    </li>
  ))}
</ul>

<h4 className="mt-4">Top Farmers</h4>

<FarmerEarningsChart
    farmers={topFarmers}
/>

<h4 className="mt-4">Revenue Trend</h4>

<ul>
  {revenueTrend.map((trend, index) => (
    <li key={index}>
      {trend.day} - ₹{trend.revenue}
    </li>
  ))}
</ul>


<h4 className="mt-4">
Monthly Sales
</h4>

<ul>

{monthlySales.map(
    (sale, index) => (

    <li key={index}>

        {sale.month}
        {" - "}
        ₹{sale.revenue}

    </li>

))}

</ul>


            {/* USERS */}



           <h2 className="mt-4">Users</h2>



<div className="table-responsive">

    <table className="table table-striped table-bordered shadow">

        <thead className="table-dark">

            <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Phone</th>

                <th>Role</th>

            </tr>

        </thead>



        <tbody>

            {users.map((user) => (

                <tr key={user.user_id}>

                    <td>{user.user_id}</td>

                    <td>{user.full_name}</td>

                    <td>{user.email}</td>

                    <td>
    {user.phone && user.phone.trim() !== ""
        ? user.phone
        : "-"}
</td>

                    <td>{user.role}</td>

                </tr>

            ))}

        </tbody>

    </table>

</div>



            {/* CROPS */}



           <h2 className="mt-5">Crops</h2>



<div className="table-responsive">

    <table className="table table-striped table-bordered shadow">

        <thead className="table-success">

            <tr>

                <th>ID</th>

                <th>Crop Name</th>

                <th>Category</th>

                <th>Quantity (kg)</th>

                <th>Price/kg</th>

                <th>Location</th>

            </tr>

        </thead>



        <tbody>

            {crops.map((crop) => (

                <tr key={crop.crop_id}>

                    <td>{crop.crop_id}</td>

                    <td>{crop.crop_name}</td>

                    <td>{crop.category}</td>

                    <td>{crop.quantity_kg}</td>

                    <td>₹{crop.price_per_kg}</td>

                    <td>{crop.location}</td>

                </tr>

            ))}

        </tbody>

    </table>

</div>



            {/* ORDERS */}



            <h2 className="mt-5">Orders</h2>



<div className="table-responsive">

    <table className="table table-striped table-bordered shadow">

        <thead className="table-primary">

            <tr>

                <th>Order ID</th>

                <th>Buyer ID</th>

                <th>Crop ID</th>

                <th>Quantity</th>

                <th>Status</th>

                <th>Invoice No</th>
<th>Payment Mode</th>
<th>Payment Status</th>

            </tr>

        </thead>



        <tbody>

            {orders.map((order) => (

                <tr key={order.order_id}>

                    <td>{order.order_id}</td>

                    <td>{order.buyer_id}</td>

                    <td>{order.crop_id}</td>

                    <td>{order.quantity_kg}</td>

                    <td>{order.status}</td>
<td>{order.invoice_number}</td>
<td>{order.payment_mode}</td>
<td>{order.payment_status}</td>



                    <td>

                        <select

                            className="form-select"

                            value={order.status}

                            onChange={(e) =>

                                updateOrderStatus(

                                    order.order_id,

                                    e.target.value

                                )

                            }

                        >

                            <option value="Pending">

                                Pending

                            </option>



                            <option value="Approved">

                                Approved

                            </option>



                            <option value="Shipped">

                                Shipped

                            </option>



                            <option value="Delivered">

                                Delivered

                            </option>

                        </select>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>



            {/* COMPLAINTS */}



            <h2 className="mt-5">Complaints</h2>



<div className="table-responsive">

    <table className="table table-striped table-bordered shadow">

        <thead className="table-danger">

            <tr>

                <th>ID</th>

                <th>Buyer ID</th>

                <th>Order ID</th>

                <th>Complaint</th>

                <th>Status</th>

            </tr>

        </thead>



        <tbody>

            {complaints.map((complaint) => (

                <tr key={complaint.complaint_id}>

                    <td>{complaint.complaint_id}</td>

                    <td>{complaint.buyer_id}</td>

                    <td>{complaint.order_id}</td>

                    <td>{complaint.complaint_text}</td>



                    <td>

                        <select

                            className="form-select"

                            value={complaint.status}

                            onChange={(e) =>

                                updateComplaintStatus(

                                    complaint.complaint_id,

                                    e.target.value

                                )

                            }

                        >

                            <option value="Open">

                                Open

                            </option>



                            <option value="Under Review">

                                Under Review

                            </option>



                            <option value="Resolved">

                                Resolved

                            </option>



                            <option value="Rejected">

                                Rejected

                            </option>

                        </select>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>



        </div>

    </>

);

}



export default AdminDashboard;

