import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutChart = () => {
    const [chartData, setChartData] = useState({
        labels: ['Corretiva', 'Preventiva'],
        datasets: [
            {
                label: 'Manutenções',
                data: [300, 200], // Valores iniciais, substituir pelos dados da API futuramente
                backgroundColor: ['#4bc0c0', '#05668D'],
                hoverBackgroundColor: ['#4bc0c0', '#05668D'],
                borderWidth: 3,
            },
        ],
    });

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('URL_DO_ENDPOINT'); // Substitua pela URL da sua API
                const data = await response.json();
                setChartData((prevState) => ({
                    ...prevState,
                    datasets: [
                        {
                            ...prevState.datasets[0],
                            data: [data.corretiva, data.preventiva],
                        },
                    ],
                }));
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();

        // Descomente a linha abaixo para habilitar a busca da API
        // fetchData();
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
                    size: 18,
                },
            },
            datalabels: {
                display: true, // Certifica-se de que os valores estejam sempre visíveis
                color: '#fff', // Cor dos números
                font: {
                    weight: 'bold',
                },
                formatter: (value) => value, // Exibe o valor numérico
                anchor: 'center',
                align: 'center',
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
