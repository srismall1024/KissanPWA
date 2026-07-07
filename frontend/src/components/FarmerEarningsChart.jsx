import { Bar } from "react-chartjs-2";

function FarmerEarningsChart({ farmers }) {

    const data = {
        labels: farmers.map(
            farmer => farmer.full_name
        ),

        datasets: [
            {
                label: "Revenue (₹)",

                data: farmers.map(
                    farmer => Number(
                        farmer.revenue
                    )
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

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                Farmer Earnings

            </div>

            <div className="card-body">

                <Bar data={data} />

            </div>

        </div>

    );
}

export default FarmerEarningsChart;