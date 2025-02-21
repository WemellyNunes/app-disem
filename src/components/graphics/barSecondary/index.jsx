import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getOrdersByCampus } from '../../../utils/api/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const LocationBarChart = ({ year }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'OS Abertas',
                data: [], // Dados iniciais substituíveis pela API futuramente
                backgroundColor: [],
                borderWidth: 0,
            },
        ],
    });

    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getOrdersByCampus(year);

                // Mapear os dados retornados pela API
                const labels = Object.keys(data).map((key) => {
                    if( key === "MARABA") { return 'Marabá'};
                    if ( key === "SANTANA_DO_ARAGUAIA") { return 'Santana do Araguaia'};
                    if ( key === "XINGUARA") { return 'Xinguará'};
                    if ( key === "SAO_FELIX_DO_XINGU") { return 'São Félix do Xingu'};
                    if ( key === "RONDON") { return 'Rondon'};
                    return key;
                }); // Pegue os nomes dos campi
                const values = Object.values(data); // Pegue os valores correspondentes

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'OS Abertas',
                            data: values,
                            backgroundColor: ['#13BFD7', '#2783ED', '#FFC300', '#F02D3A', '#FB8500'], // Ajuste as cores conforme o número de labels
                            borderWidth: 0,
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
    }, [year]);

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
                    size: 16,
                    weight: 'bold' 
                },
            },
            datalabels: {
                display: true, 
                color: '#fff', 
                font: {
                    weight: 'bold',
                },
                anchor: 'center',
                align: 'center',
                formatter: (value) => value, 
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

    if (loading) {
        return <p>Carregando...</p>;
    }

    return <Bar data={chartData} options={options} />;
};

export default LocationBarChart;
