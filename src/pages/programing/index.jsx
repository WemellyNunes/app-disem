import StatusBar from "../../components/title/statusBar";
import SectionCard from "../../components/section/sectionPrimary";
import InputPrimary from "../../components/inputs/inputPrimary";
import InputSelect from "../../components/inputs/inputSelect";
import InputUpload from "../../components/inputs/inputUpload";
import MultiSelect from "../../components/inputs/multiSelect";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import ButtonTertiary from "../../components/buttons/buttonTertiary";
import { useNavigate, useParams } from "react-router-dom";
import DateTimePicker from "../../components/inputs/dateTimePicker";
import { mockOrderServiceData } from "./dados";
import HistoryCard from "../../components/cards/historyCard";
import { useState } from "react";
import MessageBox from "../../components/box/message";
import { FaTrash, FaEdit } from "react-icons/fa";
import { TbFileExport } from "react-icons/tb";
import MaintenanceSection from "../../components/section/sectionMaintenance";
import FinalizeSection from "../../components/section/FinalizeSection";
import AddReport from "../../components/modal/report";
import ViewReports from "../../components/modal/viewReports";

export default function Programing() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [formData, setFormData] = useState({
        data: '',
        turno: '',
        encarregado: '',
        profissionais: [],
        custo: '',
        observacao: '',
    });

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
    const [finalObservation, setFinalObservation] = useState(''); // Status inicial


    const handleFinalization = (observation) => {
        setFinalObservation(observation); // Armazena a observação final
        setIsFinalized(true); // Marca a OS como finalizada
        // Aqui, a seção de finalização deve permanecer visível
    };

    const handleMaintenanceSave = () => {
        setIsMaintenanceSaved(true); // Atualiza o estado quando a manutenção é salva
    };

    const history = [
        `OS Nº ${mockOrderServiceData.requisicao} Criada em 00/00/0000 agente: Fulano da Silva `,
        `OS Nº ${mockOrderServiceData.requisicao} Editada em 00/00/0000 agente: Fulano da Silva`,
        `OS Nº ${mockOrderServiceData.requisicao} Programada em 00/00/0000 agente: Fulano da Silva`
    ];

    const orderServiceData = mockOrderServiceData;

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
        setFormData((prevData) => ({ ...prevData, profissionais: selectedOptions }));
    };

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const validateFields = () => {
        const newEmptyFields = {};
        const requiredFields = ['data', 'turno', 'encarregado', 'profissionais'];

        requiredFields.forEach((field) => {
            const value = formData[field];
            if (Array.isArray(value) ? value.length === 0 : !value.trim()) {
                newEmptyFields[field] = true;
            }
        });

        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Por favor, preencha todos os campos obrigatórios.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        setIsSaved(true);
        setIsEditing(false);
        setStatus("Em atendimento");
        setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Programação salva com sucesso!' });
        setShowMessageBox(true);
        setTimeout(() => setShowMessageBox(false), 1200);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(false);
    };

    const handleHistoryClick = () => {
        setShowHistory(true);
    };

    const handleDateChange = (date) => {
        console.log("Data selecionada:", date);
        setFormData((prevData) => ({ ...prevData, data: date }));
    };

    let colorBorder = 'border-primary-red'

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
                    <StatusBar
                        requisitionNumber={orderServiceData.requisicao}
                        origin={orderServiceData.origem}
                        situation={status}
                        reopening="nenhuma"
                        onHistoryClick={handleHistoryClick}
                        onAddReportClick={() => setShowAddReport(true)}
                        onViewReportsClick={() => setShowViewReports(true)}
                        reportsCount={reports.length}
                    />
                </div>

                <div className="flex flex-col gap-x-2.5 md:flex-row">
                    <div className="w-full md:w-5/12">
                        <SectionCard title="Dados da ordem de serviço">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <InputPrimary
                                    label="Classificação"
                                    placeholder={orderServiceData.classificacao}
                                    disabled
                                />
                                <InputPrimary
                                    label="Unidade"
                                    placeholder={orderServiceData.unidade}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-4">
                                <InputPrimary
                                    label="Solicitante"
                                    placeholder={orderServiceData.solicitante}
                                    disabled
                                />
                                <InputPrimary
                                    label="Objeto de preparo"
                                    placeholder={orderServiceData.objetoPreparo}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <InputPrimary
                                    label="Tipo de manutenção"
                                    placeholder={orderServiceData.tipoManutencao}
                                    disabled
                                />
                                <InputPrimary
                                    label="Sistema"
                                    placeholder={orderServiceData.sistema}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <InputPrimary
                                    label="Unidade da manutenção"
                                    placeholder={orderServiceData.unidadeManutencao}
                                    disabled
                                />
                                <InputPrimary
                                    label="Campus"
                                    placeholder={orderServiceData.campus}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <InputPrimary
                                    label="Data do cadastro"
                                    placeholder={orderServiceData.dataCadastro}
                                    disabled
                                />
                                <InputPrimary
                                    label="Dias em aberto"
                                    placeholder={orderServiceData.diasEmAberto}
                                    disabled
                                />
                            </div>
                            <div className="mt-2">
                                <InputUpload label="Anexar documento(s)" disabled />
                            </div>
                        </SectionCard>
                    </div>

                    <div className="flex-1 mb-4">

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

                        {isSaved && <MaintenanceSection
                            orderServiceData={orderServiceData}
                            onMaintenanceClose={setIsMaintenanceClosed}
                            onMaintenanceSave={() => {
                                setStatus("Resolvido");
                                handleMaintenanceSave();
                            }}
                        />}

                        <SectionCard title="Programação">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                                <DateTimePicker
                                    label="Data programada *"
                                    placeholder="exemplo: 00/00/0000"
                                    onDateChange={handleDateChange}
                                    disabled={!isEditing}
                                    className={emptyFields.data ? colorBorder : ''}
                                />
                                <InputSelect
                                    label="Turno *"
                                    options={options}
                                    onChange={handleFieldChange('turno')}
                                    value={formData.turno}
                                    disabled={!isEditing}
                                    className={emptyFields.turno ? colorBorder : ''}
                                />
                                <InputSelect
                                    label="Encarregado *"
                                    options={overseer}
                                    onChange={handleFieldChange('encarregado')}
                                    value={formData.encarregado}
                                    disabled={!isEditing}
                                    className={emptyFields.encarregado ? colorBorder : ''}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <MultiSelect
                                    label="Profissional(is) *"
                                    options={professionals}
                                    onChange={handleMultiSelectChange}
                                    selectedValues={formData.profissionais} // Passa as opções selecionadas corretamente
                                    disabled={!isEditing}
                                    className={emptyFields.profissionais ? colorBorder : ''}
                                />
                                <InputPrimary
                                    label="Custo estimado"
                                    placeholder="Informe"
                                    value={formData.custo}
                                    onChange={handleFieldChange('custo')}
                                    disabled={!isEditing}
                                />
                                <InputPrimary
                                    label="Observação"
                                    placeholder="Escreva uma observação (opcional)"
                                    value={formData.observacao}
                                    onChange={handleFieldChange('observacao')}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row justify-end">
                                <div className="flex flex-col md:flex-row gap-y-1.5 ">
                                    {isSaved && !isMaintenanceSaved && !isMaintenanceClosed ? (
                                        <>
                                            <ButtonTertiary
                                                bgColor="bg-white"
                                                textColor="text-red-500"
                                                icon={<FaTrash />}
                                                hoverColor="hover:bg-red-100">
                                                Excluir
                                            </ButtonTertiary>

                                            <ButtonSecondary
                                                borderColor="border border-primary-light"
                                                bgColor="bg-white"
                                                hoverColor="hover:bg-secondary-hover"
                                                textColor="text-primary-light"
                                                icon={<FaEdit />}
                                                onClick={handleEdit}>
                                                Editar
                                            </ButtonSecondary>

                                            <ButtonPrimary
                                                bgColor="bg-primary-light"
                                                hoverColor="hover:bg-primary-hover"
                                                textColor="text-white"
                                                icon={<TbFileExport />}
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

