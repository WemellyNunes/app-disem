import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePen } from "react-icons/fa6";
import { useUser } from "../../contexts/user";
import SectionCard from "../../components/section/sectionPrimary";
import InputSelect from "../../components/inputs/inputSelect";
import InputPrimary from "../../components/inputs/inputPrimary";
import RadioInput from "../../components/inputs/radioInput";
import InputUpload from "../../components/inputs/inputUpload";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import MessageBox from "../../components/box/message";
import PageTitle from "../../components/title";
import Loading from "../../components/modal/loading";
import MessageCard from "../../components/cards/menssegeCard";

import { calcularValorRisco, calcularPrioridade } from "../../utils/matriz";
import { createOrder, updateOrder, uploadDocument, getOrderById } from "../../utils/api/api";

export default function Form() {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [orderId, setOrderId] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isCreating, setIsCreating] = useState(!id);
    const [isEditing, setIsEditing] = useState(!id); 
    const [isSaved, setIsSaved] = useState(false);
    const [status, setStatus] = useState("A atender");
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const [formData, setFormData] = useState({
        selectedOption: { value: 'comum', required: false },
        classe: { value: '', required: true },
        indiceRisco: { value: '', required: true },
        valorRisco: { value: null, required: false },
        prioridade: { value: '', required: false },
        requisicao: { value: '', required: true },
        solicitante: { value: '', required: true },
        contato: { value: null, required: false },
        unidade: { value: '', required: true },
        origem: { value: '', required: true },
        manutencao: { value: '', required: true },
        sistema: { value: '', required: true },
        unidadeManutencao: { value: '', required: true },
        campus: { value: '', required: true },
        observacao: { value: null, required: false },
        objetoPreparo: { value: '', required: true },
    });

    const options = [
        { label: 'Comum', value: 'comum' },
        { label: 'ADM', value: 'adm' },
    ];

    const origin = [
        { label: 'DISEM', value: 'DISEM' },
        { label: 'SIPAC', value: 'SIPAC' },
    ];

    const classification = [
        { label: 'Classe A', value: 'A' },
        { label: 'Classe B', value: 'B' },
        { label: 'Classe C', value: 'C' }
    ];

    const unit = [
        { label: 'Instituto de Geociências e Engenharias', value: 'geo' },
        { label: 'Instituto de Ciências e Exatas', value: 'ciex' },
        { label: 'Instituto de Ciências Humanas', value: 'cih' },
        { label: 'Centro de Tecnologia e Comunicação', value: 'tec' },
    ];

    const unitMaintence = [
        { label: 'UNIDADE I - MARABÁ', value: 'mab1' },
        { label: 'UNIDADE II - MARABÁ', value: 'mab2' },
        { label: 'UNIDADE III - MARABÁ', value: 'mab3' },
        { label: 'UNIDADE SANTANA DO ARAGUAIA', value: 'santana' },
        { label: 'UNIDADE SÃO FELIX DO XINGU', value: 'saoFelix' },
        { label: 'UNIDADE RONDON', value: 'rondon' },
        { label: 'XINGUARA', value: 'xinguara' },
    ];

    const system = [
        { label: 'CIVIL', value: 'CIVIL' },
        { label: 'ELETRICO', value: 'ELETRICO' },
        { label: 'HIDROSANITARIO', value: 'HIDROSANITARIO' },
        { label: 'REFRIGERAÇÃO', value: 'REFRIGERACAO' },
        { label: 'MISTO', value: 'MISTO' }
    ];

    const maintence = [
        { label: 'CORRETIVA' },
        { label: 'PREVENTIVA' },
    ];

    const indicesRisco = [
        { label: 'Ação de sustentabilidade', value: 'sustentabilidade' },
        { label: 'Estetica interna', value: 'estetica' },
        { label: 'Conforto do usuario', value: 'confortoUsuario' },
        { label: 'Danos maiores', value: 'danosMaiores' },
        { label: 'Risco de acidentes', value: 'riscoAcidentes' }
    ];

    const campusMapping = {
        'mab1': 'MARABA',
        'mab2': 'MARABA',
        'mab3': 'MARABA',
        'santana': 'Santana do Araguaia',
        'saoFelix': 'São Félix do Xingu',
        'rondon': 'Rondon',
        'xinguara': 'Xinguara',
    };

    let colorBorder = 'border-primary-red'

    const handleFileChange = (files) => {
        setSelectedFiles(files); // Atualiza o estado com os arquivos recebidos
    };

    useEffect(() => {
        if (id) {
            setIsCreating(false); 
            setIsEditing(true); 
            fetchOrderData(id); 
        }
    }, [id]);

    const fetchOrderData = async (id) => {
        try {
            const response = await getOrderById(id); // Faz a chamada à API
            setOrderId(id);
            // Atualiza os dados do formulário com os valores do backend
            setFormData((prevData) => ({
                ...prevData,
                origem: { ...prevData.origem, value: response.origin },
                requisicao: { ...prevData.requisicao, value: response.requisition },
                classe: { ...prevData.classe, value: response.classification },
                solicitante: { ...prevData.solicitante, value: response.requester },
                contato: { ...prevData.contato, value: response.contact},
                unidade: { ...prevData.unidade, value: response.unit},
                manutencao: { ...prevData.manutencao, value: response.typeMaintenance },
                sistema: { ...prevData.sistema, value: response.system },
                unidadeManutencao: { ...prevData.unidadeManutencao, value: response.maintenanceUnit },
                campus: { ...prevData.campus, value: response.campus },
                observacao: { ...prevData.observacao, value: response.observation },
                objetoPreparo: { ...prevData.objetoPreparo, value: response.preparationObject },
                indiceRisco: { ...prevData.indiceRisco, value: response.maintenanceIndicators },
                documento: { ...prevData.documento, value: response.documents}
                // Continue para outros campos...
            }));
            setUploadedDocuments(
                response.documents.map((doc) => ({
                    name: doc.name,
                    size: doc.size,
                    description: doc.description || "Sem descrição", // Caso não tenha descrição
                }))
            );
            
            setEmptyFields({});
        } catch (error) {
            console.error("Erro ao carregar os dados da ordem de serviço:", error);
        }
    };

    useEffect(() => {
        if (orderId) {
            handleUpload();
        }
    }, [orderId]);


    const handleUpload = async () => {
        try {
            for (const fileItem of selectedFiles) {
                await uploadDocument(fileItem.file, orderId);
            }
            console.log("Documentos carregados com sucesso.");
        } catch (error) {
            console.error("Erro ao fazer upload dos documentos:", error);
        }
    };

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: { ...prevData[field], value },
            };

            if (field === 'origem' && value === 'DISEM') {
                const randomTwoDigits = Math.floor(Math.random() * 90) + 10;
                const currentYear = new Date().getFullYear();
                const requisitionNumber = `${randomTwoDigits}${currentYear}`;
                updatedData.requisicao = { ...prevData.requisicao, value: requisitionNumber };

                setEmptyFields((prevEmptyFields) => {
                    const updatedEmptyFields = { ...prevEmptyFields };
                    delete updatedEmptyFields.requisicao;
                    return updatedEmptyFields;
                });
            } else if (field === 'origem' && value === 'sipac') {
                updatedData.requisicao = { ...prevData.requisicao, value: '' };
            }

            if (field === 'unidadeManutencao') {
                const campus = campusMapping[value] || '';
                updatedData.campus = { ...prevData.campus, value: campus };

                if (campus) {
                    setEmptyFields((prevEmptyFields) => {
                        const updatedEmptyFields = { ...prevEmptyFields };
                        delete updatedEmptyFields.campus;
                        return updatedEmptyFields;
                    });
                }
            }
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

    const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
            const { value, required } = formData[field];
            if (required && (!value || value.toString().trim() === "")) {
                newEmptyFields[field] = true;
            }
        });

        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };


    const getOrderData = () => {
        const valor = calcularValorRisco(formData.classe, formData.indiceRisco);
        const prioridadeCalculada = calcularPrioridade(valor);

        return {
            origin: formData.origem.value,
            requisition: formData.requisicao.value,
            classification: formData.classe.value,
            maintenanceIndicators: formData.indiceRisco.value,
            valorRisco: valor,
            prioridade: prioridadeCalculada,
            requester: formData.solicitante.value,
            contact: formData.contato.value,
            unit: formData.unidade.value,
            maintenanceUnit: formData.unidadeManutencao.value,
            campus: formData.campus.value,
            observation: formData.observacao.value,
            preparationObject: formData.objetoPreparo.value,
            system: formData.sistema.value,
            typeMaintenance: formData.manutencao.value,
            typeTreatment: formData.selectedOption.value,
            documento: "uploads/images",
            status,
            date: new Date().toISOString().split("T")[0],
            modificationDate: new Date().toISOString().split("T")[0]
        };
    };

    const handleSave = async () => {
        if (!validateFields()) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Por favor, preencha todos os campos obrigatórios.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        setIsLoading(true);

        try {
            const ordemDeServico = getOrderData();
            const response = await createOrder(ordemDeServico);

            if (response) {
                setMessageContent({ type: 'success', title: 'Sucesso.', message: `Ordem de serviço criada com sucesso.` });
                setShowMessageBox(true);
                setOrderId(response.id);
                setIsSaved(true);
                setIsCreating(false);
                setIsEditing(false);
            }
        } catch (error) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Não foi possível salvar a ordem de serviço.' });
            setShowMessageBox(true);
            console.error("Erro ao salvar a ordem de serviço:", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(true);
    };

    const handleUpdate = async () => {
        if (!orderId) {
            console.error("ID da ordem de serviço não está definido.");
            return;
        }

        if (!validateFields()) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Por favor, preencha todos os campos obrigatórios.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        setIsLoading(true);

        try {
            const ordemDeServico = getOrderData();
            const response = await updateOrder(orderId, ordemDeServico);

            if (response) {
                setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Ordem de serviço atualizada com sucesso.' });
                setShowMessageBox(true);
                setIsSaved(true);  // Mantém como salvo
                setIsEditing(false);
                await handleUpload(); // Desativa a edição após atualizar
            }
        } catch (error) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Não foi possível atualizar a ordem de serviço.' });
            setShowMessageBox(true);
            console.error("Erro ao atualizar a ordem de serviço:", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowMessageBox(false), 2500);
        }
    };


    const handleContinue = () => {
        navigate("../Listing");
    };

    return (
        <>
            {isLoading && <Loading />}

            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}

            <div className="flex flex-col space-y-1 mb-1 mt-1 px-0 md:px-32">
                <MessageCard
                    type="info"
                    title="Info."
                    message="Os campos com '*' no final são obrigatórios."
                    storageKey="showMandatoryMessage"
                />
                <MessageCard
                    type="info"
                    title="Info."
                    message="O campo 'Índice de manutenção' indica o impacto e a prioridade da manutenção."
                    storageKey="showIndexExplanationMessage"
                />
            </div>

            <div className={` flex flex-col px-0 md:px-32 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="flex justify-center">
                    <PageTitle
                        icon={FaFilePen}
                        text={isCreating ? "Cadastro de Ordem de Serviço" : "Pré-visualização Ordem de Serviço"}
                        backgroundColor="bg-white"
                        textColor="text-primary-light"
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex-1 ">
                        <SectionCard title={"Dados da ordem de serviço"}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                                <InputSelect
                                    label="Origem *"
                                    options={origin}
                                    onChange={handleFieldChange('origem')}
                                    value={formData.origem.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.origem ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.origem ? colorBorder : ''}
                                />
                                <InputPrimary
                                    label="N° da requisição *"
                                    placeholder="Informe"
                                    value={formData.requisicao.value}
                                    onChange={handleFieldChange('requisicao')}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.requisicao ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.requisicao ? colorBorder : ''}
                                />
                                <InputSelect
                                    label="Classificação *"
                                    options={classification}
                                    onChange={handleFieldChange('classe')}
                                    value={formData.classe.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.classe ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.classe ? colorBorder : ''}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <div className="flex-1">
                        <SectionCard title="Dados do solicitante">
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6">
                                <InputPrimary
                                    label="Solicitante *"
                                    placeholder="Informe o nome do solicitante"
                                    value={formData.solicitante.value}
                                    onChange={handleFieldChange('solicitante')}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.solicitante ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.solicitante ? colorBorder : ''}
                                />

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InputSelect
                                    label="Unidade *"
                                    options={unit}
                                    onChange={handleFieldChange('unidade')}
                                    value={formData.unidade.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.unidade ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.unidade ? colorBorder : ''}
                                />
                                <InputPrimary
                                    label="Contato (ramal, telefone, email)"
                                    placeholder="Informe o contato (opcional)"
                                    value={formData.contato.value}
                                    onChange={handleFieldChange('contato')}
                                    disabled={!isEditing}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <div className="flex-1 mb-4">
                        <SectionCard title="Dados da manutenção">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <InputPrimary
                                    label="Objeto de preparo *"
                                    placeholder="Informe a descrição da manutenção"
                                    onChange={handleFieldChange('objetoPreparo')}
                                    value={formData.objetoPreparo.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.objetoPreparo ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.objetoPreparo ? colorBorder : ''}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InputSelect
                                    label="Tipo de manutenção *"
                                    options={maintence}
                                    onChange={handleFieldChange('manutencao')}
                                    value={formData.manutencao.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.manutencao ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.manutencao ? colorBorder : ''}
                                />
                                <InputSelect
                                    label="Sistema *"
                                    options={system}
                                    onChange={handleFieldChange('sistema')}
                                    value={formData.sistema.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.sistema ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.sistema ? colorBorder : ''}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6">
                                <InputSelect
                                    label="Índice de manutenção *"
                                    options={indicesRisco}
                                    onChange={handleFieldChange('indiceRisco')}
                                    value={formData.indiceRisco.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.indiceRisco ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.indiceRisco ? colorBorder : ''}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InputSelect
                                    label="Unidade da manutenção *"
                                    options={unitMaintence}
                                    onChange={handleFieldChange('unidadeManutencao')}
                                    value={formData.unidadeManutencao.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.unidadeManutencao ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.unidadeManutencao ? colorBorder : ''}
                                />
                                <InputPrimary
                                    label="Campus *"
                                    placeholder="Informe o campus (automático)"
                                    value={formData.campus.value}
                                    onChange={handleFieldChange('campus')}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.campus ? "Este campo é obrigatório" : ""}
                                    className={emptyFields.campus ? colorBorder : ''}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <InputPrimary
                                    label="Observação"
                                    placeholder="Escreva uma observação (opcional)"
                                    onChange={handleFieldChange('observacao')}
                                    value={formData.observacao.value}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <RadioInput
                                    title="Tipo de tratamento"
                                    name="tipoTratamento"
                                    options={options}
                                    selectedValue={formData.selectedOption.value}
                                    onChange={handleFieldChange('selectedOption')}
                                    disabled={!isEditing}
                                    className={emptyFields.options ? colorBorder : ''}
                                />
                                <InputUpload
                                    label="Anexar documento(s)"
                                    disabled={!isEditing}
                                    onFilesUpload={handleFileChange}
                                    initialFiles={uploadedDocuments.map((doc) => ({
                                        file: { name: doc.name, size: doc.size }, // Simula um arquivo
                                        description: doc.description || "Sem descrição", // Adicione descrição se existir
                                    }))}
                                />
                            </div>
                        </SectionCard>
                    </div>
                </div>

                <div className="flex flex-col border-t border-primary-light bg-white items-center justify-center md:flex-row h-14 md:h-16 gap-y-2npm bottom-0">
                    <div className="flex pr-0 md:pr-6">
                        {isCreating ? (
                            // Modo de criação (1): Cancelar e Salvar
                            <>
                                <ButtonSecondary onClick={() => navigate("../Listing")}>Cancelar</ButtonSecondary>
                                <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                            </>
                        ) : isEditing ? (
                            // Modo de edição (3): Cancelar e Atualizar
                            <>
                                <ButtonSecondary onClick={() => {
                                    setIsEditing(false);
                                    setShowMessageBox(false);
                                }}>Cancelar</ButtonSecondary>
                                <ButtonPrimary onClick={handleUpdate}>Atualizar</ButtonPrimary>
                            </>
                        ) : (
                            // Dados salvos ou atualizados (2 e 4): Editar e Continuar
                            <>
                                <ButtonSecondary onClick={handleEdit}>Editar</ButtonSecondary>
                                <ButtonPrimary onClick={handleContinue}>Continuar</ButtonPrimary>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
