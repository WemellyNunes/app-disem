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
        date.setMonth(monthNumber - 1); // Subtraímos 1 porque os meses no JS são indexados de 0
        return date.toLocaleString("default", { month: "long" });
    };

    useEffect(() => {
        // Atualize o título sempre que o mês mudar
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
                            backgroundColor: ['#4bc0c0', '#05668D', '#59A5D8'],
                            hoverBackgroundColor: ['#4bc0c0', '#05668D', '#59A5D8'],
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
