import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getTypeMaintenanceStatistics } from '../../../utils/api/api';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = ({year, month}) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');

    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1); 
        return date.toLocaleString("default", { month: "long" });
    };

    useEffect(() => {
        setTitle(`Tipo de manutenções abertas em ${getMonthName(month)}`);
    }, [month]);

    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getTypeMaintenanceStatistics(year, month);

                const labels = Object.keys(data).map((key) => {
                    if (key === 'CORRETIVA') return 'Corretiva';
                    if (key === 'PREVENTIVA') return 'Preventiva';
                    if (key === 'EXTRAMANUTENCAO') return 'Extramanutenção';
                    return key; 
                });

                const values = Object.values(data);
                const total = values.reduce((sum, value) => sum + value, 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ['#FB8500', '#05668D', '#F02D3A'],
                            borderWidth: 3,
                        },
                    ],
                });
            } catch (error) {
                console.error("Erro ao carregar dados do gráfico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year, month]);

    const options = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold'
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                },
            },
            datalabels: {
                display: true,
                formatter: (_, context) => {
                    const value = context.dataset.data[context.dataIndex];
                    const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`; // Exibe o valor em porcentagem
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
