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
import { FaTrash, FaEdit, FaUser, FaBuilding, FaCity, FaCalendar, FaHourglassHalf } from "react-icons/fa";
import { TbFileExport, TbCalendarTime } from "react-icons/tb";
import MaintenanceSection from "../../components/section/sectionMaintenance";
import FinalizeSection from "../../components/section/FinalizeSection";
import AddReport from "../../components/modal/report";
import ViewReports from "../../components/modal/viewReports";
import { useUser } from "../../contexts/user";
import PageTitle from "../../components/title";
import { MdTextSnippet, MdSettings, MdPriorityHigh, MdPhone } from "react-icons/md";
import { RiListSettingsFill } from "react-icons/ri";
import ConfirmationModal from "../../components/modal/confirmation";

import { getOrderById, createPrograming, getProgramingById, updatePrograming, deletePrograming, downloadReport, updateOrderServiceStatus } from "../../utils/api/api";


export default function Programing() {
    const { user, setUser } = useUser();

    const navigate = useNavigate();

    const { id } = useParams();

    const { id: orderServiceId } = useParams();

    const [formData, setFormData] = useState({
        data: { value: '', required: true },
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
    const [finalObservation, setFinalObservation] = useState('');
    const [programingId, setProgramingId] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        show: false,
        action: null, // "edit" ou "delete"
    });

    const handleFinalization = (observation) => {
        setFinalObservation(observation);
        setIsFinalized(true);
    };

    const handleMaintenanceSave = async () => {
        try {
            await updateOrderServiceStatus(orderServiceData.id, "Resolvido"); // Atualiza o status no backend
            setIsMaintenanceSaved(true); // Atualiza no frontend
            setStatus("Resolvido");
        } catch (error) {
            console.error("Erro ao atualizar status da OS:", error);
        }
    };

    const handleOpenModal = (action) => {
        setConfirmationModal({ show: true, action }); // Define a ação ("edit" ou "delete")
    };

    const handleCloseModal = () => {
        setConfirmationModal({ show: false, action: null }); // Reseta o modal
    };

    const handleConfirmAction = () => {
        if (confirmationModal.action === "edit") {
            handleEdit(); // Habilita a edição
        } else if (confirmationModal.action === "delete") {
            handleConfirmDelete(); // Confirma a exclusão
        }
        handleCloseModal(); // Fecha o modal
    };

    const overseer = [
        { label: 'Almir Lima', value: 'encarregado1' },
        { label: 'Lucas', value: 'encarregado2' },
    ];

    const options = [
        { label: '08h às 12h', value: 'manha' },
        { label: '14h às 18h', value: 'tarde' },
        { label: '19h às 22h', value: 'noite' },
        { label: '08h às 18h', value: 'integral' }
    ];

    const professionals = [
        { label: 'FULANO', value: 'fulano' },
        { label: 'CICLANO', value: 'ciclano' },
        { label: 'BELTRANO', value: 'beltrano' },
        { label: 'CABOCLO', value: 'caboclo' }
    ];

    const handleDownloadReport = async (id) => {
        try {
            await downloadReport(id); // ID da OS passado corretamente
        } catch (error) {
            setMessageContent({
                type: 'error',
                title: 'Erro ao exportar',
                message: 'Não foi possível iniciar o download do relatório. Tente novamente mais tarde.',
            });
            setShowMessageBox(true);
        }
    };

    const handleAddReport = (newReport) => {
        const reportWithUser = {
            usuario: "Fulano da Silva",
            texto: newReport,
            data: new Date().toLocaleString('pt-BR'),
        };
        setReports([...reports, reportWithUser]);
        setShowAddReport(false);
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

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderData = await getOrderById(id); // Busca a OS
                setOrderServiceData(orderData);

                setStatus(orderData.status);

                if (orderData.programingId) {
                    const programingData = await getProgramingById(orderData.programingId);

                    const formattedDate = programingData.datePrograming
                        .split('-')
                        .reverse()
                        .join('/');

                    setFormData((prevData) => ({
                        ...prevData,
                        data: { ...prevData.data, value: formattedDate },
                        turno: { ...prevData.turno, value: programingData.time },
                        encarregado: { ...prevData.encarregado, value: programingData.overseer },
                        profissionais: {
                            ...prevData.profissionais,
                            value: programingData.worker.split(', ').map(label => ({
                                label: label.trim(),
                                value: label.toLowerCase().replace(/\s/g, ''),
                            })),
                        },
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
            }
        };

        fetchOrderData();
    }, [id, programingId]);

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
            setTimeout(() => setShowMessageBox(false), 1000);
            return;
        }

        try {
            const formattedDate = formData.data.value.split('/').reverse().join('-');

            const programingData = {
                orderService_id: id,
                datePrograming: formattedDate,
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
        } catch (error) {
            console.error("Erro ao salvar programação:", error);
            setMessageContent({
                type: 'error',
                title: 'Erro.',
                message: 'Erro ao salvar a programação.'
            });
            setShowMessageBox(true);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            if (!programingId) return;

            await deletePrograming(programingId);
            const updatedOrderService = await updateOrderServiceStatus(orderServiceId, "A atender");

            // Atualiza o estado local com os novos dados da OS
            setOrderServiceData((prevData) => ({
                ...prevData,
                status: updatedOrderService.status,
            }));

            setStatus("A atender");
            setFormData({
                data: { value: '', required: true },
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
        }
    };


    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(false);
    };

    const handleHistoryClick = () => {
        setShowHistory(true);
    };

    const handleDateChange = (date) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, data: { ...prevData.data, value: date } };

            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };
                if (date) {
                    delete updatedEmptyFields.data;
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
            setIsMaintenanceSaved(orderServiceData.status === "Resolvido");
            setIsMaintenanceClosed(orderServiceData.status === "Finalizado");
        }
    }, [orderServiceData]);

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
                            icon={TbCalendarTime}
                            text="Programação"
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

                <div className="flex flex-col gap-x-2.5 md:flex-row mx-2 md:mx-6">
                    <div className="w-full md:w-5/12">
                        <SectionCard background="bg-gray-50" title="Dados da ordem de serviço">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4 text-sm text-gray-500 mb-8">
                                <div className="flex flex-row items-center gap-x-2">
                                    <MdPriorityHigh className="h-4 w-4" />
                                    <p className="font-medium">Clasificação:</p>
                                    <p className="uppercase">{orderServiceData.classification}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaUser className="h-4 w-4" />
                                    <p className="font-medium">Socilitante:</p>
                                    <p>{orderServiceData.requester}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <MdPhone className="h-4 w-4" />
                                    <p className="font-medium">Contato:</p>
                                    <p>{orderServiceData.contact}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaBuilding className="h-4 w-4" />
                                    <p className="font-medium">Unidade do solicitante:</p>
                                    <p>{orderServiceData.unit}</p>
                                </div>
                                <div className="flex items-center gap-x-2 flex-wrap">
                                    <MdTextSnippet className="h-4 w-4" />
                                    <p className="font-medium">Descrição:</p>
                                    <p>{orderServiceData.preparationObject}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <MdSettings className="h-4 w-4" />
                                    <p className="font-medium">Tipo de manutenção:</p>
                                    <p>{orderServiceData.typeMaintenance}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <RiListSettingsFill className="h-4 w-4" />
                                    <p className="font-medium">Sistema:</p>
                                    <p>{orderServiceData.system}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaBuilding className="h-4 w-4" />
                                    <p className="font-medium">Unidade da manutenção:</p>
                                    <p>{orderServiceData.maintenanceUnit}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaCity className="h-4 w-4" />
                                    <p className="mr-1 font-medium">Campus:</p>
                                    <p>{orderServiceData.campus}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaCalendar className="h-4 w-4" />
                                    <p className="mr-1 font-medium">Data do cadastro:</p>
                                    <p>{orderServiceData.date}</p>
                                </div>
                                <div className="flex flex-row items-center gap-x-2">
                                    <FaHourglassHalf className="h-4 w-4" />
                                    <p className="mr-1 font-medium">Dias em aberto:</p>
                                    <p>{orderServiceData.openDays}</p>
                                </div>
                            </div>

                            <p className="mt-2 text-sm text-gray-400">Cadastrado por: {user.name}</p>
                        </SectionCard>
                    </div>

                    <div className="flex-1 mb-2">

                        {isMaintenanceClosed && !isFinalized && (
                            <FinalizeSection
                                initialObservation={finalObservation} // Passa a observação atual
                                onFinalize={handleFinalization}
                            />
                        )}

                        {isFinalized && (
                            <FinalizeSection
                                initialObservation={finalObservation} // Passa a observação finalizada
                                onFinalize={() => {
                                    setStatus("Finalizado");
                                    handleFinalization();
                                }}
                            />
                        )}

                        {programingId && (
                            <MaintenanceSection
                                orderServiceData={{ ...orderServiceData, programingId }}
                                onMaintenanceClose={setIsMaintenanceClosed}
                                onMaintenanceSave={() => {
                                    setStatus("Resolvido");
                                    handleMaintenanceSave();
                                }}
                            />
                        )}

                        <SectionCard title="Programação">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                                <DateTimePicker
                                    label="Data programada *"
                                    placeholder="exemplo: 00/00/0000"
                                    onDateChange={handleDateChange}
                                    value={formData.data.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.data ? "Este campo é obrigatório" : ""}
                                />
                                <InputSelect
                                    label="Turno *"
                                    options={options}
                                    onChange={handleFieldChange('turno')}
                                    value={formData.turno.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.turno ? "Este campo é obrigatório" : ""}
                                />
                                <InputSelect
                                    label="Encarregado *"
                                    options={overseer}
                                    onChange={handleFieldChange('encarregado')}
                                    value={formData.encarregado.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.encarregado ? "Este campo é obrigatório" : ""}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1">
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
                                    disabled={!isEditing}
                                />
                                <InputPrimary
                                    label="Observação"
                                    placeholder="Escreva uma observação (opcional)"
                                    value={formData.observacao.value || 'sem observação'}
                                    onChange={handleFieldChange('observacao')}
                                    disabled={!isEditing}
                                />

                                {isSaved && <p className="mt-2 mb-6 text-sm text-gray-400">Programado por: {user.name}</p>}

                            </div>
                            <div className="flex flex-col md:flex-row justify-end">
                                <div className="flex flex-col md:flex-row gap-y-1.5 ">
                                    {/* Verifica o status para renderizar os botões */}
                                    {status === "Em atendimento" && !isMaintenanceClosed ? (
                                        <>
                                            <ButtonTertiary
                                                bgColor="bg-white"
                                                textColor="text-red-500"
                                                icon={<FaTrash />}
                                                hoverColor="hover:bg-red-100"
                                                onClick={() => handleOpenModal("delete")}>
                                                Excluir
                                            </ButtonTertiary>

                                            <ButtonSecondary
                                                borderColor="border border-primary-light"
                                                bgColor="bg-white"
                                                hoverColor="hover:bg-secondary-hover"
                                                textColor="text-primary-light"
                                                icon={<FaEdit />}
                                                onClick={() => handleOpenModal("edit")}>
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
                                    ) : (
                                        !isMaintenanceSaved && !isMaintenanceClosed && (
                                            <>
                                                <ButtonSecondary onClick={() => navigate("../Listing")}>Cancelar</ButtonSecondary>
                                                <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>

                        </SectionCard>
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

