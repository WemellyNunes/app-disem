import Circle from "../circle";
import { FaCirclePlus, FaRegClock } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { useState } from "react";
import HistoryCard from "../../cards/historyCard";
import ActionsMenu from "../../verticalMenu/actionMenu";
import ConfirmationModal from "../../modal/confirmation";


const List = ({ filteredData, onProgramClick }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState(null);

    const statusClasses = {
        'A atender': 'font-medium bg-status-open text-white rounded-md p-1',
        'Em atendimento': 'font-medium  text-status-prog bg-status-bgProg rounded-md p-1',
        'Resolvido': 'font-medium text-status-resp bg-status-bgResp rounded-md p-1',
        'Finalizada': 'font-medium text-status-finish bg-status-bgFinish rounded-full p-1',
        'Negada': 'font-medium text-status-negative bg-status-bgNegative rounded-full p-1'
    };

    return (
        <div className="flex flex-col w-full space-y-4">
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                    if (!item) {
                        return null;
                    }

                    const history = [
                        `OS Nº ${item.requisicao} Criada em 00/00/0000 agente: Fulano da Silva `,
                        `OS Nº ${item.requisicao} Editada em 00/00/0000 agente: Fulano da Silva`,
                        `OS Nº ${item.requisicao} Programada em 00/00/0000 agente: Fulano da Silva`
                    ];

                    const handleView = () => {
                        console.log(`Visualizar OS ${item.id}`);
                    };
                    const handleEdit = () => {
                        setActionType('edit');
                        setShowConfirmation(true);
                    };
                    const handleDelete = () => {
                        setActionType('delete');
                        setShowConfirmation(true);
                    };
                    const handleConfirmAction = () => {
                        setShowConfirmation(false);
                        if (actionType === 'edit') {
                            console.log(`Confirmar Edição da OS ${item.id}`);
                            
                        } else if (actionType === 'delete') {
                            console.log(`Confirmar Exclusão da OS ${item.id}`);
                        }
                    }


                    return (
                        <div
                            key={item.id}
                            className={`flex flex-col mt-2 md:flex-row p-4 rounded shadow-sm hover:border-b hover:border-primary-light space-y-2 md:space-y-0 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row w-full justify-between">
                                <div className="flex flex-col md:w-1/2 space-y-2 pb-2 md:pb-0 text-primary-dark text-xs md:text-sm">
                                    <span className="flex">
                                        <strong className="mr-1 ">Requisição:</strong> {item.requisicao}
                                    </span>
                                    <span className="hidden md:flex">
                                        <strong className=" mr-1">Criação:</strong> {item.criacao}
                                    </span>
                                    <span className="hidden md:flex">
                                        <strong className="mr-1">Origem:</strong> {item.origem}
                                    </span>
                                    <span className="hidden md:flex">
                                        <strong className="mr-1">Tipo de Manutenção:</strong> {item.tipo}
                                    </span>
                                </div>

                                <div className="flex flex-col md:w-1/3 space-y-2 text-primary-dark text-xs md:text-sm">
                                    <span className="flex">
                                        <strong className="mr-1">Sistema:</strong> {item.sistema}
                                    </span>
                                    <span className="flex">
                                        <strong className="mr-1">Unidade:</strong> {item.unidade}
                                    </span>
                                    <span className="flex">
                                        <strong className="mr-0 md:mr-1">Solicitante:</strong> {item.solicitante}
                                    </span>
                                    <span className="hidden md:flex">
                                        <strong className="mr-0 md:mr-1">Descrição:</strong> {item.descricao}
                                    </span>
                                </div>

                                {/* Direita - Programação, Histórico e Status */}
                                <div className="flex flex-col py-3 md:py-0  md:w-1/3 md:items-end text-sm">
                                    <button onClick={() => onProgramClick(item.id)} className="flex flex-col text-blue-600 items-center justify-center hover:underline">
                                        {item.programacao ? (
                                            <>
                                                Programação
                                                <div>
                                                    <FaRegClock />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                Sem programação
                                                <div>
                                                    <FaCirclePlus />
                                                </div>
                                            </>
                                        )}
                                    </button>

                                </div>

                                <div className="flex flex-col md:w-1/3 space-y-2 md:items-end text-primary-dark text-xs md:text-sm">
                                    <span className="flex">
                                        <Circle prioridade={item.prioridade} />
                                    </span>
                                    <span className="hidden md:flex">
                                        <ActionsMenu onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

                                        {showConfirmation && (
                                            <ConfirmationModal
                                                title={actionType === 'delete' ? "Confirmar Exclusão" : "Confirmar Edição"}
                                                message={`Tem certeza que deseja ${actionType === 'delete' ? "excluir" : "editar"} a OS ${item.id}?`}
                                                onConfirm={handleConfirmAction}
                                                onCancel={() => setShowConfirmation(false)}
                                            />
                                        )}

                                    </span>

                                    <div className="hidden md:flex items-center">
                                        <button onClick={() => setShowHistory(true)} className="flex flex-col">
                                            <div className="text-primary-light rounded-full hover:bg-status-bgProg" ><MdHistory size={20} /></div>
                                        </button>
                                    </div>

                                    <span className={`${statusClasses[item.status]}`}>
                                        {item.status}
                                    </span>

                                </div>
                            </div>
                            {showHistory && <HistoryCard history={history} onClose={() => setShowHistory(false)} />}
                        </div>
                    );
                })
            ) : (
                <div className="text-center p-4 text-sm text-gray-500">
                    Nenhum registro encontrado
                </div>
            )}

        </div>
    );
};

export default List;
