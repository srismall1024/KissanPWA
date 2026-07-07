import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

function TopSellingCropsChart({
    data
}) {

    return (

        <div className="card shadow mb-4">

            <div className="card-header bg-success text-white">
                Top Selling Crops
            </div>

            <div className="card-body">

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="crop_name"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="sold_qty"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );
}

export default TopSellingCropsChart;