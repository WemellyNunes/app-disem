import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getClassStatistics } from '../../../utils/api/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraphic = () => {
    const [graphData, setGraphData] = useState({
        labels: [],
        datasets: [],
    });

    const [loading, setLoading] = useState(true); // Estado de carregamento
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getClassStatistics();
                const labels = Object.keys(data).map(key => `Classe ${key}`);
                const values = Object.values(data);

                setGraphData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: [
                                '#00a8e8', 
                                '#4bc0c0',
                                '#00B2CA',  
                            ],
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
    }, []);



    const options = {
        indexAxis: 'y', 
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10,
                }, 
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `Classe das OS abertas em ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
                font: {
                    size: 16,
                 } // Torna o título em negrito (opcional)
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: 'gray',
                font: {
                    weight: 'bold',
                },
                formatter: (value) => value, // Exibe o valor numérico do quantitativo
            },
        },
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    return <Bar data={graphData} options={options} />;
};

export default BarGraphic;
