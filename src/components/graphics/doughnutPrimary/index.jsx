import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getTypeMaintenanceStatistics } from '../../../utils/api/api';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTypeMaintenanceStatistics();

                const labels = Object.keys(data).map((key) => {
                    if (key === 'CORRETIVA') { return 'Corretiva'};
                    if (key === 'PREVENTIVA') { return 'Preventiva'};
                    if (key === 'EXTRAMANUTENCAO') { return 'Extramanutenção'};
                    return key; // Caso outros tipos sejam adicionados
                });

                const values = Object.values(data);
                const total = values.reduce((sum, value) => sum + value, 0);
                const percentages = values.map((value) => ((value / total) * 100).toFixed(2));

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: ['#4bc0c0', '#05668D', '#59A5D8'], // Mesma ordem das labels
                            hoverBackgroundColor: ['#4bc0c0', '#05668D', '#59A5D8'],
                            borderWidth: 3,
                        },
                    ],
                });
                setChartOptions({
                    plugins: {
                        datalabels: {
                            formatter: (_, context) => {
                                const value = context.dataset.data[context.dataIndex];
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${percentage}%`; // Mostra o percentual
                            },
                            color: '#fff', // Cor do texto
                            font: {
                                weight: 'bold',
                            },
                        },
                    },
                });
            } catch (error) {
                console.error("Erro ao carregar dados do gráfico:", error);
            }
        };

        fetchData();
    }, []);


    const options = {
        responsive: true,
        cutout: '60%',
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: `Tipo de manutenções abertas em ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
                font: {
                    size: 16,
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Exibe % no tooltip
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

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
