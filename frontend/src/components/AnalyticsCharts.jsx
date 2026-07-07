// React import not required with new JSX transform
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function AnalyticsCharts({
  users = [],
  orders = [],
  complaints = [],
  revenueTrend = [],
  topFarmers = [],
  categoryRevenue = [],
  topBuyers = [],
  usersChartRef,
  ordersChartRef,
  revenueChartRef,
  farmerChartRef,
  cropChartRef
}) {

  const farmers = users.filter(
    (u) => u.role === "farmer"
  ).length;

  const buyers = users.filter(
    (u) => u.role === "buyer"
  ).length
  const usersChart = {
  labels: ["Farmers", "Buyers"],
  datasets: [
    {
      data: [farmers, buyers],
      backgroundColor: [
        "#198754", // green
        "#0d6efd", // blue
      ],
    },
  ],
};

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const approvedOrders = orders.filter((o) => o.status === "Approved").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  const ordersChart = {
  labels: ["Pending", "Approved", "Delivered"],
  datasets: [
    {
      label: "Orders",
      data: [
        pendingOrders,
        approvedOrders,
        deliveredOrders,
      ],
      backgroundColor: [
        "#ffc107", // yellow
        "#0d6efd", // blue
        "#198754", // green
      ],
    },
  ],
};

  const openComplaints = complaints.filter((c) => c.status === "Open").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved").length;

  const complaintsChart = {
  labels: ["Open", "Resolved"],
  datasets: [
    {
      data: [
        openComplaints,
        resolvedComplaints,
      ],
      backgroundColor: [
        "#dc3545", // red
        "#198754", // green
      ],
    },
  ],
};

const monthlySalesChart = {
  labels: revenueTrend.map(
    (item) =>
      new Date(item.day).toLocaleDateString()
  ),

  datasets: [
    {
      label: "Revenue",

      data: revenueTrend.map(
        (item) => Number(item.revenue)
      ),

      borderColor: "#198754",

      backgroundColor:
        "rgba(25,135,84,0.2)",

      tension: 0.4,

      fill: true
    }
  ]
};

const farmerEarningsChart = {
  labels: topFarmers.map(
    farmer => farmer.full_name
  ),

  datasets: [
    {
      label: "Revenue",

      data: topFarmers.map(
        farmer => Number(farmer.revenue)
      ),

      backgroundColor: [
        "#198754",
        "#0d6efd",
        "#ffc107",
        "#dc3545",
        "#6f42c1"
      ]
    }
  ]
};

const categoryRevenueChart = {

    labels:

        categoryRevenue.map(
            item => item.category
        ),

    datasets: [

        {

            data:

                categoryRevenue.map(
                    item =>
                    Number(
                        item.revenue
                    )
                ),

            backgroundColor: [

                "#198754",
                "#0d6efd",
                "#ffc107",
                "#dc3545",
                "#6f42c1",
                "#20c997"

            ]

        }

    ]

};

const buyerSpendingChart = {

    labels:

        topBuyers.map(
            buyer => buyer.full_name
        ),

    datasets: [

        {

            label: "Spending",

            data:

                topBuyers.map(
                    buyer =>
                    Number(
                        buyer.spending
                    )
                ),

            backgroundColor: [

                "#0d6efd",
                "#198754",
                "#ffc107",
                "#dc3545",
                "#6f42c1"

            ]

        }

    ]

};

const totalCategoryRevenue =
    categoryRevenue.reduce(
        (sum, item) =>
            sum + Number(item.revenue),
        0
    );

  return (
    <div className="row mt-4">
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header">Users By Role</div>
          <div className="card-body">
            <Doughnut
  ref={usersChartRef}
  data={usersChart}
/>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header">Orders By Status</div>
          <div className="card-body">
            <Bar
  ref={ordersChartRef}
  data={ordersChart}
/>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header">Complaints</div>
          <div className="card-body">
            <Doughnut
  data={complaintsChart}
/>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header">Crop Categories</div>
          <div className="card-body">
            <Doughnut
  ref={cropChartRef}
  data={categoryRevenueChart}
/>
          </div>
        </div>
      </div>
      <div className="col-md-12 mb-4">

  <div className="card shadow">

    <div className="card-header bg-success text-white">

      Monthly Sales Trend

    </div>

    <div className="card-body">

      <Line
  ref={revenueChartRef}
  data={monthlySalesChart}
/>
    </div>

  </div>

</div>

<div className="col-md-12 mb-4">

  <div className="card shadow">

    <div className="card-header bg-primary text-white">

      Farmer Earnings

    </div>

    <div className="card-body">

      <Bar
  ref={farmerChartRef}
  data={farmerEarningsChart}
/>

    </div>

  </div>

</div>

<div className="col-md-12 mb-4">

    <div className="card shadow">

        <div className="card-header bg-info text-white">

            Top Buyers Spending

        </div>

        <div className="card-body">

            <Bar
                data={
                    buyerSpendingChart
                }
            />

        </div>

    </div>

</div>

<h4 className="mt-4">
    Top Buyers
</h4>

<table className="table">

    <thead>

        <tr>

            <th>Buyer</th>
            <th>Spending</th>

        </tr>

    </thead>

    <tbody>

        {topBuyers.map(
            buyer => (

            <tr
                key={
                    buyer.full_name
                }
            >

                <td>
                    {buyer.full_name}
                </td>

                <td>
                    ₹{buyer.spending}
                </td>

            </tr>

        ))}

    </tbody>

</table>

<div className="card shadow mt-3">

    <div className="card-header">

        Revenue By Category

    </div>

    <div className="card-body">

        <table className="table">

            <thead>

                <tr>

                    <th>Category</th>
                    <th>Revenue</th>
                    <th>Share</th>

                </tr>

            </thead>

            <tbody>

                {categoryRevenue.map(
                    category => {

                    const share =
(
    Number(category.revenue)
    / totalCategoryRevenue
) * 100;

                    return (

                        <tr
                            key={
                                category.category
                            }
                        >

                            <td>
                                {category.category}
                            </td>

                            <td>
                                ₹
                                {category.revenue}
                            </td>

                            <td>
                                {share.toFixed(1)}%
                            </td>

                        </tr>

                    );

                })}

            </tbody>

        </table>

    </div>

</div>
    </div>
  
  );
}

export default AnalyticsCharts;
