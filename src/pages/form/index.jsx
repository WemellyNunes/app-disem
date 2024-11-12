import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../../components/section/sectionPrimary";
import InputSelect from "../../components/inputs/inputSelect";
import InputPrimary from "../../components/inputs/inputPrimary";
import RadioInput from "../../components/inputs/radioInput";
import InputUpload from "../../components/inputs/inputUpload";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import MessageBox from "../../components/box/message";
import { calcularValorRisco, calcularPrioridade } from "../../utils/matriz";
import PageTitle from "../../components/title";
import { FaFilePen } from "react-icons/fa6";
import { useUser } from "../../contexts/user";
import Loading from "../../components/modal/loading";

export default function Form() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [status, setStatus] = useState("A atender");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        selectedOption: { value: 'comum', required: false },
        classe: { value: '', required: true },
        indiceRisco: { value: '', required: true },
        valorRisco: { value: null, required: false },
        prioridade: { value: '', required: false },
        requisicao: { value: '', required: true },
        solicitante: { value: '', required: true },
        contato: {value: null, required: false},
        unidade: { value: '', required: true },
        origem: { value: '', required: true },
        manutencao: { value: '', required: true },
        sistema: { value: '', required: true },
        unidadeManutencao: { value: '', required: true },
        campus: { value: '', required: true },
        observacao: { value: null, required: false},
        objetoPreparo: { value: '', required: true },
    });

    const options = [
        { label: 'Comum', value: 'comum' },
        { label: 'ADM', value: 'adm' },
    ];

    const origin = [
        { label: 'DISEM', value: 'disem' },
        { label: 'SIPAC', value: 'sipac' },
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
        { label: 'UNIDADE RONDON', value: 'rondon' }
    ];

    const system = [
        { label: 'CIVIL', value: 'civil' },
        { label: 'ELETRICO', value: 'eletrico' },
        { label: 'HIDROSANITARIO', value: 'hidro' },
        { label: 'REFRIGERAÇÃO', value: 'refri' },
        { label: 'MISTO', value: 'misto' }
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
        'mab1': 'Marabá',
        'mab2': 'Marabá',
        'mab3': 'Marabá',
        'santana': 'Santana do Araguaia',
        'saoFelix': 'São Félix do Xingu',
        'rondon': 'Rondon',
    };

    let colorBorder = 'border-primary-red'

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: { ...prevData[field], value },
            };

            if (field === 'origem' && value === 'disem') {
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
            if (required && (!value || typeof value !== 'string' || !value.trim())) {
                newEmptyFields[field] = true;
            }
        });

        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    console.log('formData antes da validação:', formData);

    const handleSave = () => {
        if (!validateFields()) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Por favor, preencha todos os campos obrigatórios.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        setIsLoading(true);
        console.log("Loading iniciado");

        setTimeout(() => {
            const valor = calcularValorRisco(formData.classe, formData.indiceRisco);
            setFormData((prevData) => ({ ...prevData, valorRisco: valor }));

            const prioridadeCalculada = calcularPrioridade(valor);
            setFormData((prevData) => ({ ...prevData, prioridade: prioridadeCalculada }));

            const ordemDeServico = {
                ...formData,
                status,
                valorRisco: valor,
                prioridade: prioridadeCalculada,
                tratamento: formData.selectedOption,
                documento: "caminho_do_arquivo",
            };

            console.log('Dados da ordem de serviço:', ordemDeServico);

            setIsLoading(false);
            setIsSaved(true);
            setIsEditing(false);
            setMessageContent({ type: 'success', title: 'Sucesso.', message: `Ordem de serviço salva com prioridade: ${prioridadeCalculada}` });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 2500);
        }, 1000);
    };


    const handleEdit = () => {
        setIsEditing(true);
        setIsSaved(false);
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

            <div className={` flex flex-col px-0 md:px-32 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                <div className="flex justify-center">
                    <PageTitle
                        icon={FaFilePen}
                        text="Cadastro de Ordem de Serviço"
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
                                    placeholder="Informe"
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
                                    placeholder="Informe"
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
                                    placeholder="Informe"
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
                                    label="Indice de risco *"
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
                                    placeholder="Informe"
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
                                    onChange={handleFieldChange('objetoPreparo')}
                                    value={formData.objetoPreparo.value}
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
                                />
                            </div>
                        </SectionCard>
                    </div>
                </div>

                <div className="flex flex-col border-t border-primary-light bg-white items-center justify-center md:flex-row h-14 md:h-16 gap-y-2npm bottom-0">
                    <div className="flex pr-0 md:pr-6">
                        {isSaved ? (
                            <>
                                <ButtonSecondary onClick={handleEdit}>Editar</ButtonSecondary>
                                <ButtonPrimary onClick={handleContinue}>Continuar</ButtonPrimary>
                            </>
                        ) : (
                            <>
                                <ButtonSecondary onClick={() => navigate("../Listing")}>Cancelar</ButtonSecondary>
                                <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
