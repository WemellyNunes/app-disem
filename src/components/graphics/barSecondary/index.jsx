import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const LocationBarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [
            'Campus Marabá',
            'Campus Santana do Araguaia',
            'Campus Xinguara',
            'Campus São Felix do Xingu',
            'Campus Rondon do Pará'
        ],
        datasets: [
            {
                label: 'OS Abertas',
                data: [50, 30, 20, 40, 25], // Dados iniciais substituíveis pela API futuramente
                backgroundColor: ['#13BFD7', '#2783ED', '#59A5D8', '#386FA4', '#133C55'],
                borderWidth: 0,
            },
        ],
    });

    useEffect(() => {
        // Função para buscar dados da API
        const fetchData = async () => {
            try {
                const response = await fetch('URL_DO_ENDPOINT'); // Substitua pela URL da sua API
                const data = await response.json();
                setChartData((prevState) => ({
                    ...prevState,
                    datasets: [
                        {
                            ...prevState.datasets[0],
                            data: data.osData, // Ajuste o campo conforme o retorno da API
                        },
                    ],
                }));
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        // Descomente a linha abaixo para habilitar a busca da API
         fetchData();
    }, []);

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'OS abertas por localidade',
                font: {
                    size: 18, // Aumenta o tamanho do título
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
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default LocationBarChart;
