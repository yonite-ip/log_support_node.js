import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartWidget: React.FC = () => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{
            label: "Sales",
            data: [10, 20, 30, 40],
            borderColor: "blue",
            borderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div style={{ width: "400px", height: "300px" }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default ChartWidget;
