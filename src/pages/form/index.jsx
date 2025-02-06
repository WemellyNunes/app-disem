import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePen } from "react-icons/fa6";
import { useUser } from "../../contexts/user";
import InputSelect from "../../components/inputs/inputSelect";
import InputPrimary from "../../components/inputs/inputPrimary";
import RadioInput from "../../components/inputs/radioInput";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import MessageBox from "../../components/box/message";
import PageTitle from "../../components/title";
import Loading from "../../components/modal/loading";
import MessageCard from "../../components/cards/menssegeCard";
import UploadModalFiles from "../../components/modal/uploadFiles";
import DocumentList from "../../components/documents";
import ButtonUpload from "../../components/buttons/buttonUpload";

import { useNotifications } from "../../contexts/notification/NotificationContext";
import { origin, classification, options, system, indicesRisco, maintence } from "../../utils/constants/selectOptions";
import { calcularValorRisco, calcularPrioridade } from "../../utils/matriz";
import { createOrder, updateOrder, getOrderById, getAllInstitutes, getAllUnits, getDocumentsByOrderServiceId } from "../../utils/api/api";

export default function Form() {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();


    const [orderId, setOrderId] = useState(null);
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isCreating, setIsCreating] = useState(!id);
    const [isEditing, setIsEditing] = useState(!id);
    const [isSaved, setIsSaved] = useState(false);
    const [status, setStatus] = useState("A atender");
    const [isLoading, setIsLoading] = useState(false);
    const [institutes, setInstitutes] = useState([]);
    const [units, setUnits] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        selectedOption: { value: 'comum', required: false },
        classe: { value: '', required: true },
        indiceRisco: { value: '', required: true },
        valorRisco: { value: '', required: false },
        prioridade: { value: '', required: false },
        requisicao: { value: '', required: true },
        solicitante: { value: '', required: true },
        contato: { value: '', required: false },
        unidade: { value: '', required: true },
        origem: { value: '', required: true },
        manutencao: { value: 'CORRETIVA', required: true },
        sistema: { value: '', required: true },
        unidadeManutencao: { value: '', required: true },
        campus: { value: '', required: true },
        observacao: { value: '', required: false },
        objetoPreparo: { value: '', required: true },
    });


    useEffect(() => {
        if (orderId) {
            fetchDocuments(orderId);
        }
    }, [orderId]);

    const fetchDocuments = async (orderId) => {
        try {
            console.log(`📂 Buscando documentos para OS ID: ${orderId}`);
            const response = await getDocumentsByOrderServiceId(orderId);
            setDocuments(response);
            console.log("📂 Documentos encontrados:", response);
        } catch (error) {
            console.error("❌ Erro ao buscar documentos:", error);
        }
    };

    
    useEffect(() => {
        const fetchInstitutes = async () => {
            try {
                const response = await getAllInstitutes(); 
                const formattedInstitutes = response.map((institute) => ({
                    label: `${institute.name.toUpperCase()} - ${institute.acronym.toUpperCase()}`,
                    value: institute.name, 
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
                setInstitutes(formattedInstitutes);
            } catch (error) {
                console.error("Erro ao buscar institutos:", error);
            }
        };
    
        fetchInstitutes();
    }, []);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await getAllUnits(); 
                const formattedUnits = response.map((unit) => ({
                    label: unit.unit.toUpperCase(),
                    value: unit.unit,
                    campus: unit.campus.toUpperCase(),
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
                setUnits(formattedUnits);
            } catch (error) {
                console.error("Erro ao buscar unidades:", error);
            }
        };
    
        fetchUnits();
    }, []);



    useEffect(() => {
        document.body.classList.add("bg-form-page");

        return () => {
            document.body.classList.remove("bg-form-page");
        };
    }, []);

    useEffect(() => {
        if (id) {
            setIsCreating(false);
            setIsEditing(true);
            fetchOrderData(id);
        }
    }, [id]);

    const fetchOrderData = async (id) => {
        try {
            const response = await getOrderById(id);
            setOrderId(id);

            setFormData((prevData) => ({
                ...prevData,
                origem: { ...prevData.origem, value: response.origin },
                requisicao: { ...prevData.requisicao, value: response.requisition },
                classe: { ...prevData.classe, value: response.classification },
                solicitante: { ...prevData.solicitante, value: response.requester },
                contato: { ...prevData.contato, value: response.contact },
                unidade: { ...prevData.unidade, value: response.unit },
                manutencao: { ...prevData.manutencao, value: response.typeMaintenance },
                sistema: { ...prevData.sistema, value: response.system },
                unidadeManutencao: { ...prevData.unidadeManutencao, value: response.maintenanceUnit },
                campus: { ...prevData.campus, value: response.campus },
                observacao: { ...prevData.observacao, value: response.observation },
                objetoPreparo: { ...prevData.objetoPreparo, value: response.preparationObject },
                indiceRisco: { ...prevData.indiceRisco, value: response.maintenanceIndicators },
                

            }));

            setEmptyFields({});
        } catch (error) {
            console.error("Erro ao carregar os dados da ordem de serviço:", error);
        }
    };
    
    

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: { ...prevData[field], value },
            };

            if (field === 'origem' && value === 'DISEM') {
                const randomNumber = Math.floor(Math.random() * 90000) + 10000;
                const requisitionNumber = randomNumber;
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
                const selectedUnit = units.find((unit) => unit.value === value); 
                if (selectedUnit) {
                    updatedData.campus = { ...prevData.campus, value: selectedUnit.campus }; 
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

            if (response && response.id) {
                setOrderId(response.id);
                setIsSaved(true);
                setIsCreating(false);
                setIsEditing(false);
                setMessageContent({ type: 'success', title: 'Sucesso.', message: `Ordem de serviço criada com sucesso.` });
                setShowMessageBox(true);
                addNotification(`Nova OS cadastrada n°${response.requisition} em ${response.date}`);
            } else {
                throw new Error("Erro ao criar OS. Nenhum ID retornado.");
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
                setIsSaved(true);
                setIsEditing(false);
                

                setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Ordem de serviço atualizada com sucesso.' });
                setShowMessageBox(true);
                setTimeout(() => setShowMessageBox(false), 1500);
            }
        } catch (error) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Não foi possível atualizar a ordem de serviço.' });
            setShowMessageBox(true);
            console.error("Erro ao atualizar a ordem de serviço:", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    const handleContinue = () => {
        navigate("../Listing");
    };

    const handleRemoveDocument = (documentId) => {
        setDocuments((prevDocuments) => prevDocuments.filter(doc => doc.id !== documentId));
    };
    
    const handleUploadSuccess = () => {
        fetchDocuments(orderId); // Busca a lista de documentos atualizada diretamente da API
    };
    
    

    const handleKeyDown = (event) => {
        if (/\d/.test(event.key)) {
            event.preventDefault(); // Bloqueia a entrada de números
        }
    };
    const handleKeyNumber = (event) => {
        if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
            event.preventDefault();
        }
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

            <div className={` flex flex-col px-0  ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="">
                    <PageTitle
                        icon={FaFilePen}
                        text={isCreating ? "Cadastro de ordem de serviço" : "Pré-visualização ordem de serviço"}
                        backgroundColor="bg-white"
                        textColor="text-primary-dark"
                    />
                </div>
                <div className="flex md:mx-6 mt-1 justify-center items-center flex-col py-1 gap-y-1 ">
                    <MessageCard
                        type="info"
                        message="Os campos com '*' no final são obrigatórios."
                        storageKey="showMandatoryMessage"
                    />
                    <MessageCard
                        type="info"
                        message="O campo 'Índice de manutenção' indica o impacto e a prioridade da manutenção."
                        storageKey="showIndexExplanationMessage"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center bg-white border border-gray-300 mt-2 mb-2 px-8 py-4 md:px-16  w-full md:w-[850px] rounded-xl">
                        <div className="flex-1 mb-2 w-full">
                            <p className="text-sm md:text-base font-medium text-gray-800 my-6 pb-2.5 border-b border-gray-300">Formulário de cadastro</p>
                            <p className="text-sm md:text-base font-medium text-gray-800 my-6">1. Dados da ordem de serviço</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                                <InputSelect
                                    label="Origem *"
                                    options={origin}
                                    onChange={handleFieldChange('origem')}
                                    value={formData.origem.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.origem ? "Este campo é obrigatório" : ""}
                                />
                                <InputPrimary
                                    label="N° da requisição *"
                                    placeholder="Informe"
                                    value={formData.requisicao.value}
                                    type="number"
                                    onChange={handleFieldChange('requisicao')}
                                    onKeyDown={handleKeyNumber}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.requisicao ? "Este campo é obrigatório" : ""}
                                />
                                <InputSelect
                                    label="Classificação *"
                                    options={classification}
                                    onChange={handleFieldChange('classe')}
                                    value={formData.classe.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.classe ? "Este campo é obrigatório" : ""}
                                />
                            </div>
                        </div>

                        <div className="flex-1 mb-2 w-full">
                            <p className="text-sm md:text-base font-medium text-gray-800 mt-3 mb-6">3. Dados do solicitante</p>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6">
                                <InputPrimary
                                    label="Solicitante *"
                                    placeholder="Informe o nome do solicitante"
                                    value={formData.solicitante.value.toUpperCase()}
                                    onChange={handleFieldChange('solicitante')}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.solicitante ? "Este campo é obrigatório" : ""}
                                />

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InputSelect
                                    label="Unidade *"
                                    options={institutes}
                                    onChange={handleFieldChange('unidade')}
                                    value={formData.unidade.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.unidade ? "Este campo é obrigatório" : ""}
                                />
                                <InputPrimary
                                    label="Contato (ramal, telefone, email)"
                                    placeholder="Informe o contato (opcional)"
                                    value={formData.contato.value.toUpperCase()}
                                    onChange={handleFieldChange('contato')}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="flex-1 mb-4 w-full">
                            <p className="text-sm md:text-base font-medium text-gray-800 mt-3 mb-6">3. Dados da manutenção</p>
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <InputPrimary
                                    label="Objeto de preparo *"
                                    placeholder="Informe a descrição da manutenção"
                                    onChange={handleFieldChange('objetoPreparo')}
                                    value={formData.objetoPreparo.value.toUpperCase()}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.objetoPreparo ? "Este campo é obrigatório" : ""}
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
                                />
                                <InputSelect
                                    label="Sistema *"
                                    options={system}
                                    onChange={handleFieldChange('sistema')}
                                    value={formData.sistema.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.sistema ? "Este campo é obrigatório" : ""}
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
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <InputSelect
                                    label="Unidade da manutenção *"
                                    options={units}
                                    onChange={handleFieldChange('unidadeManutencao')}
                                    value={formData.unidadeManutencao.value}
                                    disabled={!isEditing}
                                    errorMessage={emptyFields.unidadeManutencao ? "Este campo é obrigatório" : ""}
                                />
                                <InputPrimary
                                    label="Campus *"
                                    placeholder="Automático"
                                    value={formData.campus.value}
                                    onChange={handleFieldChange('campus')}
                                    disabled
                                    errorMessage={emptyFields.campus ? "Este campo é obrigatório" : ""}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <InputPrimary
                                    label="Observação"
                                    placeholder="Escreva uma observação (opcional)"
                                    onChange={handleFieldChange('observacao')}
                                    value={formData.observacao.value.toUpperCase()}
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
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <DocumentList documents={documents} onRemove={handleRemoveDocument} />
                            </div>

                        </div>
                        <div className="flex w-full justify-center items-center py-4">
                            <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-3 ">
                                {isCreating ? (
                                    <>
                                        <ButtonSecondary onClick={() => navigate("../Listing")}>Cancelar</ButtonSecondary>
                                        <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <ButtonSecondary onClick={() => {
                                            setIsEditing(false);
                                            setShowMessageBox(false);
                                        }}>Cancelar</ButtonSecondary>
                                        <ButtonUpload onClick={() => setIsModalOpen(true)}>
                                            Anexar documentos
                                        </ButtonUpload>
                                        <ButtonPrimary onClick={handleUpdate}>Atualizar</ButtonPrimary>
                                    </>
                                ) : (
                                    <>
                                        <ButtonSecondary onClick={handleEdit}>Editar</ButtonSecondary>
                                        <ButtonUpload onClick={() => setIsModalOpen(true)}>
                                            Anexar documentos
                                        </ButtonUpload>
                                        <ButtonPrimary onClick={handleContinue}>Continuar</ButtonPrimary>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <UploadModalFiles 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    orderId={orderId} 
                    onUploadSuccess={handleUploadSuccess} />

            </div>

        </>
    );
}
