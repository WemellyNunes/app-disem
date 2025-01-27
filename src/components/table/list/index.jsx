import Circle from "../circle";
import { FaCirclePlus, FaRegClock } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryCard from "../../cards/historyCard";
import ActionsMenu from "../../verticalMenu/actionMenu";
import ConfirmationModal from "../../modal/confirmation";
import MessageBox from "../../box/message";
import { TbClipboardOff } from "react-icons/tb";
import { MdEngineering, MdHistory } from "react-icons/md";
import { FiTool } from "react-icons/fi";


import { updateOrderServiceStatus, deleteOrder, getHistoryByOrderId } from "../../../utils/api/api";

const List = ({ filteredData, onDeleteItem }) => {
    const navigate = useNavigate();

    const [showHistory, setShowHistory] = useState(false);
    const [currentHistory, setCurrentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });

    const statusClasses = {
        'A atender': 'font-medium text-white bg-orange-500 rounded-md p-1.5 text-xs',
        'Em atendimento': 'font-medium text-white bg-blue-700 rounded-md p-1.5 text-xs',
        'Atendida': 'font-medium text-white bg-green-600 rounded-md p-1.5 text-xs',
        'Finalizado': 'font-medium text-white bg-gray-500 rounded-md p-1.5 text-xs',
        'Negada': 'font-medium text-white bg-red-600 rounded-md p-1.5 text-xs'
    };

    const fetchHistory = async (orderId) => {
        setLoadingHistory(true);
        try {
            const history = await getHistoryByOrderId(orderId); // Chamada da API
            setCurrentHistory(history); // Armazena o histórico retornado
        } catch (error) {
            console.error("Erro ao buscar o histórico:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleShowHistory = (orderId) => {
        fetchHistory(orderId); // Busca o histórico ao abrir o modal
        setShowHistory(true);
    };

    const handleDelete = (id) => {
        setActionType('delete');
        setSelectedId(id);
        setShowConfirmation(true);
    };

    const handleEdit = (id) => {
        setActionType('edit');
        setSelectedId(id);
        setShowConfirmation(true);
    };

    const handleNegate = async (id) => {
        setActionType('negate');
        setSelectedId(id);
        setShowConfirmation(true);
    }

    const handleProgramClick = (id) => {
        navigate(`/programing/${id}`);
    };

    const handleConfirmAction = async () => {
        setShowConfirmation(false);

        if (actionType === 'delete') {
            try {
                await deleteOrder(selectedId);
                console.log(`OS ${selectedId} deletada com sucesso.`);

                if (onDeleteItem) {
                    onDeleteItem(selectedId);
                }

                setMessageContent({
                    type: 'success',
                    title: 'Sucesso',
                    message: `A OS ${selectedId} foi removida com sucesso.`,
                });
                setShowMessageBox(true);

                setTimeout(() => setShowMessageBox(false), 1500);

            } catch (error) {
                console.error(`Erro ao deletar OS ${selectedId}:`, error);
            }
        } else if (actionType === 'edit') {
            navigate(`/form/${selectedId}`);

        } else if (actionType === 'negate') {
            try {
                await updateOrderServiceStatus(selectedId, 'Negada');
                console.log(`OS ${selectedId} negada com sucesso.`);

                setMessageContent({
                    type: 'success',
                    title: 'Sucesso',
                    message: `A OS ${selectedId} foi negada com sucesso.`,
                });
                setShowMessageBox(true);

                navigate(`/programing/${selectedId}`);

                setTimeout(() => setShowMessageBox(false), 1500);
            } catch (error) {
                console.error(`Erro ao negar OS ${selectedId}:`, error);
                setMessageContent({
                    type: 'error',
                    title: 'Erro',
                    message: `Não foi possível negar a OS ${selectedId}.`,
                });
                setShowMessageBox(true);
                setTimeout(() => setShowMessageBox(false), 1500);
            }
        }
    };


    return (
        <>
            {showConfirmation && (
                <ConfirmationModal
                    title={
                        actionType === 'edit'
                            ? 'Confirmar Edição'
                            : actionType === 'delete'
                                ? 'Confirmar Exclusão'
                                : 'Confirmar Negação'
                    }
                    message={
                        actionType === 'edit'
                            ? `Tem certeza que deseja editar a OS ${selectedId}?`
                            : actionType === 'delete'
                                ? `Tem certeza que deseja excluir a OS ${selectedId}?`
                                : `Tem certeza que deseja negar a OS ${selectedId}?`
                    }
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}

            <div className="flex flex-col w-full space-y-2">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                        if (!item) {
                            return null;
                        }
                        const history = [
                            `OS Nº ${item.requisition} Criada em 00/00/0000 agente: Fulano da Silva `,
                        ];
                        return (
                            <div
                                key={item.id}
                                className={`flex flex-col mt-2 md:flex-row p-4 rounded-xl shadow-sm border border-gray-300 hover:border hover:border-primary-light space-y-1 md:space-y-1 bg-white`}
                            >
                                <div className="flex flex-col md:flex-row w-full justify-between">
                                    <div className="flex flex-col md:w-1/3 md:space-y-1 pb-1 md:pb-1 text-primary-dark text-xs ">
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-medium mr-1 ">Requisição:</p>
                                            <p>{item.requisition}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Criação:</p>
                                            <p>{item.date}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-medium mr-1">Origem:</p>
                                            <p>{item.origin}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-medium mr-1">Manutenção:</p>
                                            <p>{item.typeMaintenance}</p>
                                        </span>

                                    </div>

                                    <div className="flex flex-col md:w-1/2 space-y-1 text-primary-dark text-xs ">
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-medium mr-1">Sistema:</p>
                                            <p>{item.system}</p>
                                        </span>

                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-medium mr-1">Unidade da manutenção:</p>
                                            <p className="uppercase" >{item.maintenanceUnit}</p>
                                        </span>
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-medium mr-1">Solicitante:</p>
                                            <p className="uppercase">{item.requester}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-medium mr-0 md:mr-1">Descrição:</p>
                                            <p className="uppercase">{item.preparationObject}</p>
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-3 md:py-0  md:w-1/3 md:items-end text-sm">
                                        <button
                                            onClick={() => handleProgramClick(item.id)}
                                            className="flex flex-col items-center justify-center"
                                        >
                                            {(item.status === "Atendida" || item.status === "Finalizado" || item.status === "Negada") ? (
                                                <>
                                                    <div className="flex items-center border border-primary-light rounded-md p-2 text-primary-light gap-x-1  hover:bg-blue-100 ">
                                                        <MdEngineering className="h-4 w-4" />
                                                        <span className="">Ver atendimento</span>
                                                    </div>
                                                </>
                                            ) : item.programingId ? (
                                                <>
                                                    <div className="flex items-center border border-primary-light rounded-md p-2 text-primary-light gap-x-1  hover:bg-blue-100 ">
                                                        <FiTool className="h-3.5 w-3.5" />
                                                        <span className="text-primary-light">Atender</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center border border-primary-light rounded-md p-2 text-primary-light gap-x-1  hover:bg-blue-100 ">
                                                        <FaPlus className="h-3 w-3"/>
                                                        <span >Adicionar programação</span>
                                                    </div>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex flex-col md:w-1/3 space-y-2 md:items-end text-primary-dark text-xs md:text-sm">
                                        <span className="flex">
                                            {item.typeTreatment === 'adm' ? (
                                                <span className="font-bold text-xs text-blue-700">ADM</span>
                                            ) : (
                                                <Circle prioridade={item.prioridade} />
                                            )}
                                        </span>
                                        <span className="hidden md:flex">
                                            <ActionsMenu
                                                onEdit={() => handleEdit(item.id)}
                                                onDelete={() => handleDelete(item.id)}
                                                onNegate={() => handleNegate(item.id)}
                                                showNegate={item.status === 'A atender'} 
                                            />
                                        </span>
                                        <div className="hidden items-center">
                                            <button onClick={() => handleShowHistory(item.id)} className="flex flex-col">
                                                <div className="text-primary-light rounded-full hover:bg-status-bgProg" ><MdHistory size={20} /></div>
                                            </button>
                                        </div>

                                        <span className={`${statusClasses[item.status]}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                </div>
                                {showHistory && (
                                    <HistoryCard
                                        history={currentHistory}
                                        onClose={() => setShowHistory(false)}
                                        loading={loadingHistory} />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className=" flex flex-col items-center justify-center p-4 text-sm text-gray-500">
                        <div>
                            <TbClipboardOff className="h-6 w-6 text-gray-300" />
                        </div>
                        <div>
                            Nenhum registro encontrado
                        </div>
                    </div>
                )}

            </div>
            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}
        </>
    );
};

export default List;



