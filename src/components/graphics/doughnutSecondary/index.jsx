import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getOrdersBySystemStatistics } from '../../../utils/api/api';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DoughnutSystem = ({ year }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getOrdersBySystemStatistics(year);

                const labels = Object.keys(data).map((key) => {
                    if( key === "CIVIL") { return 'Civil'};
                    if ( key === "ELETRICO") { return 'Elétrico'};
                    if ( key === "HIDROSANITARIO") { return 'Hidrosanitário'};
                    if ( key === "REFRIGERACAO") { return 'Refrigeração'};
                    if ( key === "MISTO") { return 'Misto'};
                    return key;
                });

                const values = Object.values(data);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Manutenções',
                            data: values,
                            backgroundColor: [
                                '#F02D3A', // Civil
                                '#538D22', // Hidrosanitário
                                '#FB8500', // Refrigeração
                                '#00B2CA', // Elétrico
                                '#FFC300', // Misto
                            ],
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
    }, [year]);

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
                    size: 16,
                    weight: 'bold'
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

    if (loading) {
        return <p>Carregando...</p>;
    }

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutSystem;
