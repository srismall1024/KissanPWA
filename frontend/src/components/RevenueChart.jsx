import { useEffect, useState } from "react";
import API from "../services/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function RevenueChart() {

    const [data, setData] = useState([]);

    useEffect(() => {

        const fetchChart = async () => {

            try {

                const res =
                    await API.get(
                        "/dashboard/revenue-chart"
                    );

                setData(
                    res.data.data
                );

            } catch (err) {

                console.error(err);

            }
        };

        fetchChart();

    }, []);

    return (

        <div className="card shadow mb-4">

            <div className="card-header bg-dark text-white">

                Revenue Trend

            </div>

            <div className="card-body">

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <LineChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#28a745"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );
}

export default RevenueChart;