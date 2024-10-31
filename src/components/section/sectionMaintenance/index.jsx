import { useState, useEffect } from "react";
import InputUpload from "../../inputs/inputUpload";
import InputPrimary from "../../inputs/inputPrimary";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import Checklist from "../../checklist";
import MessageBox from "../../box/message";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";

const MaintenanceSection = ({ orderServiceData, onMaintenanceClose, onMaintenanceSave }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

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
        checklistType: [],
        observation: '',
        filesBefore: [],
        filesAfter: [],
    });

    const disciplines = ['Piso', 'Esquadraria', 'Pluvial', 'Estrutura'];
    const services = [
        'Tipo de serviço realizado 1',
        'Tipo de serviço realizado 2',
        'Tipo de serviço realizado 3',
        'Tipo de serviço realizado 4',
        'Tipo de serviço realizado 5',
        'Tipo de serviço realizado 6',
    ];

    const dadoOS = orderServiceData;
    const maintenanceType = dadoOS.tipoManutencao.toLowerCase();
    const isPreventive = maintenanceType === 'preventiva';

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const validateFields = () => {
        const newEmptyFields = {};
        
        if (isPreventive && formData.checklistType.length === 0) {
            newEmptyFields.checklistType = true;
        }
        if (formData.filesBefore.length === 0) {
            newEmptyFields.filesBefore = true; 
        }
        if (formData.filesAfter.length === 0){
            newEmptyFields.filesAfter = true;
        }

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
        setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Dados da manutenção salvos com sucesso!' });
        setShowMessageBox(true);
        onMaintenanceSave();
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
                <span className="text-primary-light">{isOpen ? <IoIosRemoveCircleOutline size={25}/> : <IoIosAddCircleOutline size={25}/>}</span>
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
                            className={emptyFields.filesBefore ? colorBorder : ''}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - pós manutenção *</p>
                        <InputUpload
                            label="Anexar arquivo(s)"
                            onFilesUpload={(files) => handleFieldChange('filesAfter')(files)}
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
