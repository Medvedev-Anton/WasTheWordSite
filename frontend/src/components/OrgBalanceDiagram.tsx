import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './OrgBalanceDiagram.css';

Chart.register(ArcElement, Tooltip, Legend);


export default function OrgBalanceDiagram({ orgId }) {
    const [orgBalance, setOrgBalance] = useState<number>(0);
    const [totalOrgsBalance, setTotalOrgsBalance] = useState<number>(0);
    const [chartData, setChartData] = useState<Record<string, any>>({
        labels: ['Бюджет организации', 'Общий бюджет всех организаций'],
        datasets: [
            {
                label: 'Бюджет',
                data: [50, 50],
                backgroundColor: ['#20b24d', '#3f49cb'],
                hoverOffset: 10,
            },
        ],
    });

    useEffect(() => {
        fetchOrgBalance();
        fetchTotalOrgsBalances();
    }, []);

    useEffect(() => {
        setChartData({
            labels: ['Бюджет организации', 'Общий бюджет всех организаций'],
            datasets: [
                {
                    label: 'Бюджет',
                    data: [orgBalance, totalOrgsBalance - orgBalance],
                    backgroundColor: ['#D6D6D6', '#8C5C5C'],
                    hoverOffset: 10,
                },
            ],
        });
    }, [orgBalance, totalOrgsBalance]);

    // Запрос на получение баланса организации
    const fetchOrgBalance = async () => {
        const result = await axios.get(`/api/organizations/${orgId}/balance`);
        const balance = +(parseFloat(result.data.balance || 0) / 100).toFixed(2);
        console.log(result.data);
        setOrgBalance(balance);
    }
    
    // Запрос на получение общей суммы балансов всех организаций
    const fetchTotalOrgsBalances = async () => {
        const result = await axios.get(`/api/organizations/total-balances`);
        const balance = +(parseFloat(result.data.totalBalances || 0) / 100).toFixed(2);
        setTotalOrgsBalance(balance);
    }

    const options = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            position: 'bottom',
            labels: { padding: 20 },
        },
        tooltip: {
            enabled: true,
            callbacks: {
                label: (context) => {
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${context.label}: ${percentage}%`;
                }
            },
        },
        },
    };

    return (
        <div 
            className="org-balance-chart-wrapper"
        >
            <h2>
                Бюджет организации
            </h2>
            <Pie data={chartData} options={options} />
            <p className="org-balance-chart__balance">
                {orgBalance} BFB
            </p>
        </div>
    );
}