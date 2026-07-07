import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from "recharts";

function RevenueOrdersTrendChart({
    data
}) {

    return (

        <div className="card shadow mb-4">

            <div className="card-header bg-dark text-white">
                Revenue vs Orders Trend
            </div>

            <div className="card-body">

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <LineChart
                        data={data}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="day"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                        />

                        <Line
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default RevenueOrdersTrendChart;