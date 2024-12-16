const Circle = ({ prioridade }) => {
    const prioridadeClasses = {
        'Execução Imediata': 'bg-red-500',
        'Execução em até 7 dias': 'bg-orange-400',
        'Execução em até 15 dias': 'bg-yellow-300',
        'Execução em até 30 dias': 'bg-green-400',
    };

    return (
        <div className={`w-2 h-2 rounded-full ${prioridadeClasses[prioridade]}`} />
    );
};

export default Circle;