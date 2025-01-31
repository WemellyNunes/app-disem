import StatusBar from "../../components/title/statusBar";
import SectionCard from "../../components/section/sectionPrimary";
import InputPrimary from "../../components/inputs/inputPrimary";
import InputSelect from "../../components/inputs/inputSelect";
import MultiSelect from "../../components/inputs/multiSelect";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import ButtonTertiary from "../../components/buttons/buttonTertiary";
import { useNavigate, useParams } from "react-router-dom";
import DateTimePicker from "../../components/inputs/dateTimePicker";
import HistoryCard from "../../components/cards/historyCard";
import { useState, useEffect } from "react";
import MessageBox from "../../components/box/message";
import { FaTrash, FaEdit } from "react-icons/fa";
import { TbFileExport } from "react-icons/tb";
import MaintenanceSection from "../../components/section/sectionMaintenance";
import FinalizeSection from "../../components/section/FinalizeSection";
import AddReport from "../../components/modal/report";
import ViewReports from "../../components/modal/viewReports";
import { useUser } from "../../contexts/user";
import PageTitle from "../../components/title";
import { GrHostMaintenance } from "react-icons/gr";
import ConfirmationModal from "../../components/modal/confirmation";
import NegationSection from "../../components/section/SectionNegation";
import OrderServiceDetails from "../../components/section/sectionOS";

import { hours } from "../../utils/constants/selectOptions";
import { getOrderById, createPrograming, getProgramingById, updatePrograming, deletePrograming, downloadReport, updateOrderServiceStatus, createNote, getNotesByProgramingId, updateOpenDays, getAllTeams } from "../../utils/api/api";


export default function Programing() {
    const { user, setUser } = useUser();

    const { id } = useParams();

    const { id: orderServiceId } = useParams();

    const [formData, setFormData] = useState({
        startData: { value: '', required: true },
        endData: { value: '', required: false},
        turno: { value: '', required: true },
        encarregado: { value: '', required: true },
        profissionais: { value: [], required: true },
        custo: { value: '', required: false },
        observacao: { value: '', required: false },
    });

    const [orderServiceData, setOrderServiceData] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);
    const [isMaintenanceSaved, setIsMaintenanceSaved] = useState(false);
    const [showAddReport, setShowAddReport] = useState(false);
    const [showViewReports, setShowViewReports] = useState(false);
    const [reports, setReports] = useState([])
    const [status, setStatus] = useState("A atender");
    const [programingId, setProgramingId] = useState(null);
    const [professionals, setProfessionals] = useState([]);
    const [overseers, setOverseers] = useState([]);

    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        action: null,
    });

    const handleFinalization = (observation) => {
        setIsFinalized(true);
        console.log("Observação finalizada:", observation);
    };

    const handleMaintenanceClose = () => {
        setIsMaintenanceClosed(true);
    };

    const handleMaintenanceSave = async () => {
        try {
            await updateOrderServiceStatus(orderServiceData.id, "Atendida");
            setIsMaintenanceSaved(true);
            setStatus("Atendida");
        } catch (error) {
            console.error("Erro ao atualizar status da OS:", error);
        }
    };

    const handleOpenModal = (action) => {
        setConfirmationModal({ show: true, action }); 
    };

    const handleCloseModal = () => {
        setConfirmationModal({ show: false, action: null }); 
    };

    const handleConfirmAction = () => {
        if (confirmationModal.action === "edit") {
            handleEdit();
        } else if (confirmationModal.action === "delete") {
            handleConfirmDelete();
        }
        handleCloseModal();
    };


    const handleDownloadReport = async (id) => {
        try {
            await downloadReport(id); 
        } catch (error) {
            setMessageContent({
                type: 'error',
                title: 'Erro ao exportar',
                message: 'Não foi possível iniciar o download do relatório. Tente novamente mais tarde.',
            });
            setShowMessageBox(true);
        }
    };

    useEffect(() => {
        const fetchReports = async () => {
            if (!programingId) return;

            try {
                const notes = await getNotesByProgramingId(programingId); 
                const formattedReports = notes.map((note) => ({
                    id: note.id,
                    usuario: note.usuario || "Desconhecido",
                    texto: note.content,
                    data: `${note.date} ${note.time}`,
                }));
                setReports(formattedReports);
            } catch (error) {
                console.error("Erro ao buscar relatos:", error);
            }
        };

        fetchReports();
    }, [programingId]);


    const handleAddReport = async (newReport) => {
        if (!programingId) { return; }

        const noteData = {
            programing_id: programingId,
            content: newReport,
        };

        try {
            const createdNote = await createNote(noteData);

            const reportWithUser = {
                usuario: user.name,
                texto: createdNote.content,
                data: `${createdNote.date} ${createdNote.time}`,
            };

            setReports((prevReports) => [...prevReports, reportWithUser]);
            setShowAddReport(false);

        } catch (error) {
            console.error("Erro ao adicionar relato:", error);
        }
    };

    const handleMultiSelectChange = (selectedOptions) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, profissionais: { ...prevData.profissionais, value: selectedOptions } };

            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };
                if (selectedOptions.length > 0) {
                    delete updatedEmptyFields.profissionais;
                }
                return updatedEmptyFields;
            });

            return updatedData;
        });
    };

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: { ...prevData[field], value },
            };

            if (updatedData[field].required && value.trim()) {
                setEmptyFields((prevEmptyFields) => {
                    const updatedEmptyFields = { ...prevEmptyFields };
                    delete updatedEmptyFields[field];
                    return updatedEmptyFields;
                });
            }
            return updatedData;
        });
    };

    const fetchProfessionals = async () => {
        try {
            const data = await getAllTeams();

            const activeProfessionals = data
                .filter((team) => team.status.toUpperCase() === "ATIVO")
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            const formattedProfessionals = activeProfessionals.map((team) => ({
                label: `${team.name.toUpperCase()} - ${team.role.toUpperCase()}`,
                value: team.name
            }));
            setProfessionals(formattedProfessionals);

            const formattedOverseers = data
                .filter((team) => team.role.toLowerCase().startsWith("líder"))
                .map((team) => ({
                    label: `${team.name.toUpperCase()} - ${team.role.toUpperCase()}`,
                    value: team.name
                }));
            setOverseers(formattedOverseers);

        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        }
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            try {

                if (professionals.length === 0) {
                    await fetchProfessionals();
                }

                const orderData = await getOrderById(id);
                setOrderServiceData(orderData);

                setStatus(orderData.status);

                if (orderData.programingId) {
                    const programingData = await getProgramingById(orderData.programingId);

                    const formattedDate1 = programingData.startDate
                        ? programingData.startDate.split('-').reverse().join('/')
                        : '';

                    const formattedDate2 = programingData.endDate
                        ? programingData.endDate.split('-').reverse().join('/')
                        : '';

                    const selectedProfessionals = programingData.worker
                        .split(', ')
                        .map(worker => {
                            const professional = professionals.find(prof => prof.label === worker.trim());
                            return professional ? { label: professional.label, value: professional.value } : null;
                        })
                        .filter(Boolean);

                    setFormData((prevData) => ({
                        ...prevData,
                        startData: { ...prevData.startData, value: formattedDate1 },
                        endData: { ...prevData.endData, value: formattedDate2 },
                        turno: { ...prevData.turno, value: programingData.time },
                        encarregado: { ...prevData.encarregado, value: programingData.overseer },
                        profissionais: { ...prevData.profissionais, value: selectedProfessionals },
                        custo: { ...prevData.custo, value: programingData.cost },
                        observacao: { ...prevData.observacao, value: programingData.observation },
                    }));

                    setProgramingId(orderData.programingId);
                    setIsSaved(true);
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Erro ao buscar dados da OS ou programação:", error);
                setMessageContent({
                    type: 'error',
                    title: 'Erro ao carregar dados',
                    message: error.message || 'Não foi possível carregar os dados.',
                });
                setShowMessageBox(true);
                setTimeout(() => setShowMessageBox(false), 1500);
            }
        };
        fetchOrderData();

    }, [id, professionals]);

    const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
            const { value, required } = formData[field];

            if (required) {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        newEmptyFields[field] = true;
                    }
                } else if (!value || (typeof value === 'string' && !value.trim())) {
                    newEmptyFields[field] = true;
                }
            }
        });

        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            setMessageContent({
                type: 'error',
                title: 'Erro.',
                message: 'Por favor, preencha todos os campos obrigatórios.'
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        try {
            const formattedDate1 = formData.startData.value.split('/').reverse().join('-');
            const formattedDate2 = formData.endData.value.split('/').reverse().join('-');

            const programingData = {
                orderService_id: id,
                startDate: formattedDate1,
                endDate: formattedDate2,
                time: formData.turno.value,
                overseer: formData.encarregado.value,
                worker: formData.profissionais.value.map(prof => prof.label).join(', '),
                cost: parseFloat(formData.custo.value || 0),
                observation: formData.observacao.value || '',
                creationDate: new Date().toISOString().split('T')[0],
                modificationDate: new Date().toISOString().split('T')[0],
                active: 'true',
            };

            let newProgramingId;
            if (programingId) {
                await updatePrograming(programingId, programingData);
                newProgramingId = programingId;
            } else {
                const response = await createPrograming({
                    ...programingData,
                    orderService_id: id,
                });
                newProgramingId = response.id;
            }

            setProgramingId(newProgramingId);

            const updatedOrder = await updateOpenDays(id); 
            setOrderServiceData(updatedOrder);

            setOrderServiceData((prevData) => ({
                ...prevData,
                status: "Em atendimento"
            }));

            setStatus("Em atendimento");
            setIsSaved(true);
            setIsEditing(false);
            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: "Programação salva com sucesso!",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);

            const programingDataReloaded = await getProgramingById(newProgramingId);
            const selectedProfessionals = programingDataReloaded.worker.split(', ').map(worker => {
                const professional = professionals.find(prof => prof.label === worker.trim());
                return professional ? { label: professional.label, value: professional.value } : null;
            }).filter(Boolean);

            setFormData((prevData) => ({
                ...prevData,
                profissionais: { ...prevData.profissionais, value: selectedProfessionals },
            }));

        } catch (error) {
            console.error("Erro ao salvar programação:", error);
            setMessageContent({
                type: 'error',
                title: 'Erro.',
                message: 'Erro ao salvar a programação.'
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (!programingId) return;

            await deletePrograming(programingId);
            const updatedOrderService = await updateOrderServiceStatus(orderServiceId, "A atender");

            setOrderServiceData((prevData) => ({
                ...prevData,
                status: updatedOrderService.status,
            }));

            setStatus("A atender");
            setFormData({
                startData: { value: '', required: true },
                endData: { value: '', required: false},
                turno: { value: '', required: true },
                encarregado: { value: '', required: true },
                profissionais: { value: [], required: true },
                custo: { value: null, required: false },
                observacao: { value: null, required: false },
            });

            setProgramingId(null);
            setIsSaved(false);
            setIsEditing(true);

            setMessageContent({
                type: "success",
                title: "Exclusão bem-sucedida",
                message: "Programação excluída com sucesso! Status da OS atualizado para 'A atender'.",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);

            handleCloseModal();
        } catch (error) {
            console.error("Erro ao excluir a programação:", error);

            setMessageContent({
                type: "error",
                title: "Erro ao excluir",
                message: "Não foi possível excluir a programação. Tente novamente.",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(false);
    };

    const handleHistoryClick = () => {
        setShowHistory(true);
    };

    const handleDateChange = (field) => (date) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [field]: { ...prevData[field], value: date } };
    
            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };
                if (date) {
                    delete updatedEmptyFields[field];
                } else if (formData[field]?.required) {
                    updatedEmptyFields[field] = true;
                }
                return updatedEmptyFields;
            });
    
            return updatedData;
        });
    };
    

    useEffect(() => {
        if (isMaintenanceSaved) {
            setIsEditing(false);
            setIsSaved(true);
        }
    }, [isMaintenanceSaved]);

    useEffect(() => {
        if (orderServiceData) {
            setIsMaintenanceSaved(orderServiceData.status === "Atendida");
            setIsMaintenanceClosed(orderServiceData.status === "Finalizado");
        }
    }, [orderServiceData]);

    const handleKeyNumber = (event) => {
        if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
            event.preventDefault();
        }
    };

    if (!orderServiceData) {
        return <p>Carregando dados da OS...</p>;
    }

    return (
        <>
            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}
            <div className="flex flex-col">

                <div className="flex flex-col">
                    <div className="flex justify-center">
                        <PageTitle
                            icon={GrHostMaintenance}
                            text="Atendimento da Ordem de Serviço"
                            backgroundColor="bg-white"
                            textColor="text-primary-dark"
                        />
                    </div>
                    <StatusBar
                        requisitionNumber={orderServiceData?.requisition || "Carregando..."}
                        origin={orderServiceData?.origin || "Carregando..."}
                        situation={status || "carregando..."}
                        reopening="nenhuma"
                        onHistoryClick={handleHistoryClick}
                        onAddReportClick={() => setShowAddReport(true)}
                        onViewReportsClick={() => setShowViewReports(true)}
                        reportsCount={reports.length}
                    />

                </div>

                <div className="flex flex-col gap-x-4 md:flex-row mx-2 md:mx-6 mt-2">
                    <div className="w-full md:w-5/12">
                        <OrderServiceDetails
                            orderServiceData={orderServiceData}
                            user={user}
                        />
                    </div>

                    <div className="flex-1 mb-2">

                        {status === "Negada" && (
                            <NegationSection orderServiceId={orderServiceId} />
                        )}

                        {isMaintenanceClosed && programingId && (
                            <FinalizeSection
                                orderServiceData={{ ...orderServiceData, programingId }}
                                onFinalize={isFinalized ? () => { } : handleFinalization}
                                isFinalized={isFinalized}
                            />
                        )}

                        {programingId && (
                            <MaintenanceSection
                                orderServiceData={{ ...orderServiceData, programingId }}
                                onMaintenanceClose={handleMaintenanceClose}
                                onMaintenanceSave={() => {
                                    setStatus("Atendida");
                                    handleMaintenanceSave();
                                }}
                            />
                        )}

                        {status !== "Negada" && (
                            <SectionCard title="Programação" placeholder="Agende a programação para a realização da manutenção.">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                                    <DateTimePicker
                                        label="Data inicial *"
                                        placeholder="exemplo: 00/00/0000"
                                        onDateChange={handleDateChange('startData')}
                                        value={formData.startData.value}
                                        disabled={!isEditing}
                                        errorMessage={emptyFields.startData ? "Este campo é obrigatório" : ""}
                                    />
                                    <DateTimePicker
                                        label="Data final"
                                        placeholder="exemplo: 00/00/0000"
                                        onDateChange={handleDateChange('endData')}
                                        value={formData.endData.value}
                                        disabled={!isEditing}
                                        errorMessage={emptyFields.endData ? "Este campo é obrigatório" : ""}
                                    />
                                    <InputSelect
                                        label="Turno *"
                                        options={hours}
                                        onChange={handleFieldChange('turno')}
                                        value={formData.turno.value}
                                        disabled={!isEditing}
                                        errorMessage={emptyFields.turno ? "Este campo é obrigatório" : ""}
                                    />
                                    
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1">
                                <InputSelect
                                        label="Encarregado *"
                                        options={overseers}
                                        onChange={handleFieldChange('encarregado')}
                                        value={formData.encarregado.value}
                                        disabled={!isEditing}
                                        errorMessage={emptyFields.encarregado ? "Este campo é obrigatório" : ""}
                                    />
                                    <MultiSelect
                                        label="Profissional(is) *"
                                        options={professionals}
                                        onChange={handleMultiSelectChange}
                                        selectedValues={formData.profissionais.value}
                                        disabled={!isEditing}
                                        errorMessage={emptyFields.profissionais ? "Este campo é obrigatório" : ""}
                                    />
                                    <InputPrimary
                                        label="Custo estimado"
                                        placeholder="Informe"
                                        value={formData.custo.value}
                                        onChange={handleFieldChange('custo')}
                                        onKeyDown={handleKeyNumber}
                                        disabled={!isEditing}
                                    />
                                    <InputPrimary
                                        label="Observação"
                                        placeholder="Escreva uma observação (opcional)"
                                        value={formData.observacao.value}
                                        onChange={handleFieldChange('observacao')}
                                        disabled={!isEditing}
                                    />

                                    {isSaved && <p className="mt-2 mb-6 text-sm text-gray-400">Programado por: {user.name}</p>}

                                </div>
                                <div className="flex flex-col py-4  md:flex-row justify-end">
                                    <div className="flex flex-col md:flex-row gap-y-1.5 md:gap-x-3 ">
                                        {isEditing ? (
                                            <>
                                                <ButtonSecondary onClick={() => setIsEditing(false)}>Cancelar</ButtonSecondary>
                                                <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                                            </>
                                        ) : (
                                            <>
                                                {status === "Em atendimento" && !isMaintenanceClosed ? (
                                                    <>
                                                        <ButtonTertiary
                                                            bgColor="bg-white"
                                                            textColor="text-red-500"
                                                            icon={<FaTrash />}
                                                            hoverColor="hover:bg-red-100"
                                                            onClick={() => handleOpenModal("delete")}
                                                        >
                                                            Excluir
                                                        </ButtonTertiary>

                                                        <ButtonSecondary
                                                            borderColor="border border-primary-light"
                                                            bgColor="bg-white"
                                                            hoverColor="hover:bg-secondary-hover"
                                                            textColor="text-primary-light"
                                                            icon={<FaEdit />}
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            Editar
                                                        </ButtonSecondary>

                                                        <ButtonPrimary
                                                            bgColor="bg-primary-light"
                                                            hoverColor="hover:bg-primary-hover"
                                                            textColor="text-white"
                                                            icon={<TbFileExport />}
                                                            onClick={() => handleDownloadReport(orderServiceId)}
                                                        >
                                                            Exportar
                                                        </ButtonPrimary>
                                                    </>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SectionCard>
                        )}

                    </div>
                </div>
                {confirmationModal.show && (
                    <ConfirmationModal
                        title={
                            confirmationModal.action === "edit"
                                ? "Confirmar Edição"
                                : "Confirmar Exclusão"
                        }
                        message={
                            confirmationModal.action === "edit"
                                ? "Tem certeza de que deseja habilitar a edição?"
                                : "Tem certeza de que deseja excluir esta programação? Esta ação não pode ser desfeita."
                        }
                        onConfirm={handleConfirmAction} // Executa a ação correspondente
                        onCancel={handleCloseModal} // Fecha o modal
                    />
                )}
            </div>
            {showAddReport && (
                <AddReport
                    onAdd={handleAddReport}
                    onCancel={() => setShowAddReport(false)}
                />
            )}
            {showViewReports && (
                <ViewReports
                    reports={reports}
                    onClose={() => setShowViewReports(false)}
                />
            )}
            {showHistory && <HistoryCard history={history} onClose={() => setShowHistory(false)} />}


        </>
    );
};

