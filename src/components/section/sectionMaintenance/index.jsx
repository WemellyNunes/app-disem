import { useState, useEffect } from "react";
import InputUpload from "../../inputs/inputUpload";
import InputPrimary from "../../inputs/inputPrimary";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import Checklist from "../../checklist";
import MessageBox from "../../box/message";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { useUser } from "../../../contexts/user";


const MaintenanceSection = ({ orderServiceData, onMaintenanceClose, onMaintenanceSave }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const { user, setUser } = useUser();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClose = () => {
        setIsEditing(false);
        setIsMaintenanceClosed(true);
        onMaintenanceClose(true);
    };

    const [formData, setFormData] = useState({
        observation: { value: null, required: false },
        filesBefore: { value: [], required: true },
        filesAfter: { value: [], required: true },
    });


    const dadoOS = orderServiceData;
    const maintenanceType = dadoOS.tipoManutencao.toLowerCase();
    const isPreventive = maintenanceType === 'preventiva';

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [field]: { ...prevData[field], value } };

            // Atualizar emptyFields para remover o campo do estado se ele for preenchido
            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };
                if (updatedData[field].required) {
                    if (Array.isArray(value)) {
                        // Se o campo for um array, verifica se está vazio
                        if (value.length > 0) {
                            delete updatedEmptyFields[field];
                        }
                    } else if (value && value.trim()) {
                        // Para strings, verifica se estão preenchidas
                        delete updatedEmptyFields[field];
                    }
                }
                return updatedEmptyFields;
            });

            return updatedData;
        });
    };

    const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
            const { value, required } = formData[field];

            if (required) {
                if (Array.isArray(value)) {
                    // Para arrays (como `filesBefore` e `filesAfter`), verifica se estão vazios
                    if (value.length === 0) {
                        newEmptyFields[field] = true;
                    }
                } else if (!value || (typeof value === 'string' && !value.trim())) {
                    // Para strings, verifica se estão vazias
                    newEmptyFields[field] = true;
                }
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

        setIsEditing(false);
        setIsSaved(true);
        setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Dados da manutenção salvos com sucesso!' });
        setShowMessageBox(true);
        onMaintenanceSave();
        setUser({ name: "Fulano da Silva", id: "123" });
        setTimeout(() => setShowMessageBox(false), 1200);
    };

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    let colorBorder = 'border-primary-red';

    return (
        <div className="flex flex-col bg-white rounded mb-2 mt-2 shadow">
            <div className="flex justify-between rounded items-center px-4 md:px-6 py-4 cursor-pointer bg-white" onClick={toggleSection}>
                <h3 className="text-sm md:text-base font-normal text-primary-light">Manutenção</h3>
                <span className="text-primary-light">{isOpen ? <IoIosRemoveCircleOutline size={25} /> : <IoIosAddCircleOutline size={25} />}</span>
            </div>
            {isOpen && (
                <div className="px-4 md:px-6">
                    {isPreventive && (
                        <div className={`border rounded p-2 mb-4 ${emptyFields.checklistType ? colorBorder : ''}`}>
                            <div className="font-normal text-sm md:text-sm text-primary-dark pb-2">
                                <span>Checklist - Manutenção preventiva *</span>
                            </div>
                            <Checklist
                                disciplines={disciplines}
                                services={services}
                                onChange={(selectedDisciplines, selectedServices) => {
                                    if (isEditing) {
                                        handleFieldChange('checklistType')(selectedDisciplines);
                                    }
                                }}
                                disabled={!isEditing}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - antes da manutenção *</p>
                        <InputUpload
                            label="Anexar arquivo(s)"
                            onFilesUpload={(files) => handleFieldChange('filesBefore')(files)}
                            errorMessage={emptyFields.filesBefore ? "Este campo é obrigatório" : ""}
                            className={emptyFields.filesBefore ? colorBorder : ''}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - pós manutenção *</p>
                        <InputUpload
                            label="Anexar arquivo(s)"
                            onFilesUpload={(files) => handleFieldChange('filesAfter')(files)}
                            errorMessage={emptyFields.filesAfter ? "Este campo é obrigatório" : ""}
                            className={emptyFields.filesAfter ? colorBorder : ''}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <InputPrimary
                            label="Observação"
                            placeholder="Escreva uma observação (opcional)"
                            value={formData.observation}
                            onChange={handleFieldChange('observation')}
                            disabled={!isEditing}
                        />
                        {isSaved && <p className="mt-2 text-sm mb-3 text-gray-400">Enviado por: {user.name}</p>}
                    </div>
                    <div className="flex flex-col md:flex-row justify-end">
                        <div className="flex flex-col pb-4 md:flex-row gap-y-1.5 ">
                            {isEditing && !isMaintenanceClosed ? (
                                <>
                                    <ButtonSecondary onClick={() => setIsOpen(false)}>Cancelar</ButtonSecondary>
                                    <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                                </>
                            ) : (
                                !isMaintenanceClosed &&
                                <>
                                    <ButtonSecondary onClick={() => setIsEditing(true)}>Editar</ButtonSecondary>
                                    <ButtonPrimary onClick={handleClose}>Encerrar</ButtonPrimary>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}
        </div>
    );
};

export default MaintenanceSection;
