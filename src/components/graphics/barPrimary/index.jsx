import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarGraphic = () => {
    const [graphData, setGraphData] = useState({
        labels: ['Classe A', 'Classe B', 'Classe C'],
        datasets: [
            {
                label: 'Meu Conjunto de Dados',
                data: [20, 50, 70], 
                backgroundColor: [
                    'rgba(0, 168, 232, 0.9)', 
                    'rgba(0, 168, 232, 0.9)',
                    'rgba(0, 168, 232, 0.9)',  
                ],
                
                borderWidth: 0,
            },
        ],
    });

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    useEffect(() => {
        // Função assíncrona para buscar dados da API
        const fetchData = async () => {
            try {
                const response = await fetch('URL_DO_ENDPOINT'); // Substitua pela URL da sua API
                const data = await response.json();
                // Atualiza os dados do gráfico com os valores retornados pela API
                setGraphData((prevState) => ({
                    ...prevState,
                    datasets: [
                        {
                            ...prevState.datasets[0],
                            data: [data.classeA, data.classeB, data.classeC], // Ajuste os campos conforme o retorno da API
                        },
                    ],
                }));
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData(); 
    }, []);

    const options = {
        indexAxis: 'y', 
        scales: {
            x: {
                beginAtZero: true,
                max: 90, 
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Classe das OS cadastradas em ${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`,
                font: {
                    size: 18, // Aumenta o tamanho do título
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

    return <Bar data={graphData} options={options} />;
};

export default BarGraphic;
