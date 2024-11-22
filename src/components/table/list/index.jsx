import Circle from "../circle";
import { FaCirclePlus, FaRegClock } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { useState } from "react";
import { deleteOrder } from "../../../utils/api/api";
import { useNavigate } from "react-router-dom";
import HistoryCard from "../../cards/historyCard";
import ActionsMenu from "../../verticalMenu/actionMenu";
import ConfirmationModal from "../../modal/confirmation";
import MessageBox from "../../box/message";
import { TbClipboardOff } from "react-icons/tb";


const List = ({ filteredData, setFilteredData, onProgramClick }) => {
    const navigate = useNavigate();

    const [showHistory, setShowHistory] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });

    const statusClasses = {
        'A atender': 'font-medium text-orange-500 bg-orange-100 rounded-md p-1',
        'Em atendimento': 'font-medium  text-status-prog bg-status-bgProg rounded-md p-1',
        'Resolvido': 'font-medium text-status-resp bg-status-bgResp rounded-md p-1',
        'Finalizada': 'font-medium text-status-finish bg-status-bgFinish rounded-full p-1',
        'Negada': 'font-medium text-status-negative bg-status-bgNegative rounded-full p-1'
    };

    const handleDelete = (id) => {
        setActionType('delete');
        setSelectedId(id); // Armazena o ID da OS a ser deletada
        setShowConfirmation(true);
    };

    const handleEdit = (id) => {
        setActionType('edit');
        setSelectedId(id); // Armazena o ID da OS a ser editada
        setShowConfirmation(true);
    };

    const handleConfirmAction = async () => {
        setShowConfirmation(false); // Fecha o modal

        if (actionType === 'delete') {
            try {
                await deleteOrder(selectedId); // Chama o endpoint de exclusão
                console.log(`OS ${selectedId} deletada com sucesso.`);

                // Atualizar a lista localmente
                const updatedData = filteredData.filter((item) => item.id !== selectedId);
                setFilteredData(updatedData); // Atualiza o estado da lista no pai

                setMessageContent({
                    type: 'success',
                    title: 'Sucesso',
                    message: `A OS ${selectedId} foi removida com sucesso.`,
                });
                setShowMessageBox(true);

                // Ocultar a mensagem após alguns segundos
                setTimeout(() => setShowMessageBox(false), 1500);

            } catch (error) {
                console.error(`Erro ao deletar OS ${selectedId}:`, error);
            }
        } else if (actionType === 'edit') {
            // Redireciona para o formulário no modo de edição
            navigate(`/form/${selectedId}`);
        }
    };

    return (
        <>
            {showConfirmation && (
                <ConfirmationModal
                    title={
                        actionType === 'edit'
                            ? 'Confirmar Edição'
                            : 'Confirmar Exclusão'
                    }
                    message={
                        actionType === 'edit'
                            ? `Tem certeza que deseja editar a OS ${selectedId}?`
                            : `Tem certeza que deseja excluir a OS ${selectedId}?`
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
                                className={`flex flex-col mt-2 md:flex-row p-4 rounded shadow-sm border border-gray-400 hover:border hover:border-primary-light space-y-1 md:space-y-0 bg-white`}
                            >
                                <div className="flex flex-col md:flex-row w-full justify-between">
                                    <div className="flex flex-col md:w-1/2 space-y-1 pb-2 md:pb-0 text-primary-dark text-xs md:text-sm">
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1 ">Requisição:</p>
                                            <p>{item.requisition}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Criação:</p>
                                            <p>{item.date}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Origem:</p>
                                            <p>{item.origin}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Manutenção:</p>
                                            <p>{item.typeMaintenance}</p>
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:w-1/3 space-y-1 text-primary-dark text-xs md:text-sm">
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Sistema:</p>
                                            <p>{item.system}</p>
                                        </span>
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Unidade:</p>
                                            <p className="uppercase" >{item.maintenanceUnit}</p>
                                        </span>
                                        <span className="flex flex-row flex-wrap">
                                            <p className="font-semibold mr-1">Solicitante:</p>
                                            <p className="uppercase">{item.requester}</p>
                                        </span>
                                        <span className="hidden md:flex flex-row flex-wrap">
                                            <p className="font-semibold mr-0 md:mr-1">Descrição:</p>
                                            <p className="uppercase">{item.preparationObject}</p>
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center py-3 md:py-0  md:w-1/3 md:items-end text-sm">
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

                                    <div className="flex flex-col md:w-1/3 space-y-1 md:items-end text-primary-dark text-xs md:text-sm">
                                        <span className="flex">
                                            <Circle prioridade={item.prioridade} />
                                        </span>
                                        <span className="hidden md:flex">
                                            <ActionsMenu
                                                onEdit={() => handleEdit(item.id)}
                                                onDelete={() => handleDelete(item.id)}
                                            />

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
                    <div className=" flex flex-col items-center justify-center p-4 text-sm text-gray-500">
                        <div>
                            <TbClipboardOff className="h-6 w-6 text-gray-300"/>
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
