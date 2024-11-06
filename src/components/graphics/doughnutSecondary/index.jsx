import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutSystem = () => {
    const [chartData, setChartData] = useState({
        labels: ['Civil', 'Hidrosanitário', 'Refrigeração', 'Elétrico', 'Misto'],
        datasets: [
            {
                label: 'Manutenções',
                data: [10, 15, 20, 25, 30], // Valores iniciais substituíveis pela API futuramente
                backgroundColor: [
                    '#247B7B', // Civil
                    '#78CDD7', // Hidrosanitário
                    '#0C7489', // Refrigeração
                    '#00B2CA', // Elétrico
                    '#09BC8A', // Misto
                ],
                borderWidth: 3,
            },
        ],
    });

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
                            data: data.systemData, // Ajuste o campo conforme o retorno da API
                        },
                    ],
                }));
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

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
                text: 'Manutenções abertas por tipo de sistema',
                font: {
                    size: 18, // Aumenta o tamanho do título
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
                display: true, // Exibe os valores diretamente
                color: '#fff', // Define a cor dos valores como branca
                font: {
                    weight: 'bold',
                },
                anchor: 'center',
                align: 'center',
                formatter: (value) => value, // Exibe o valor numérico
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutSystem;
