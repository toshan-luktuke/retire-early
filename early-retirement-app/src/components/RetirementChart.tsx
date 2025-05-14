import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface RetirementChartProps {
    chartData: any;
    probability: number;
}

const RetirementChart: React.FC<RetirementChartProps> = ({ chartData, probability }) => {
    return (
        <div className="chart-container" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h3>Retirement Projection Chart</h3>
            <Line data={chartData} />
            <div className="probability-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3>Probability to Reach Goal</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{probability}%</p>
            </div>
        </div>
    );
};

export default RetirementChart;