import { useState, useEffect } from "react";
import InputUpload from "../../inputs/inputUpload";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import MessageBox from "../../box/message";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { useUser } from "../../../contexts/user";
import {updateOrderServiceStatus, uploadFiles, getAllImages } from "../../../utils/api/api";


const MaintenanceSection = ({ orderServiceData, onMaintenanceClose, onMaintenanceSave }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    const { user, setUser } = useUser();

    const programingId = orderServiceData?.programingId || null;

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
        onMaintenanceClose();
    };

    const [formData, setFormData] = useState({
        filesBefore: { value: [], required: true },
        filesAfter: { value: [], required: true },
    });

    const handleFieldChange = (field) => (filesWithDescriptions) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [field]: {
                    ...prevData[field],
                    value: filesWithDescriptions, // Atualiza o estado com arquivos e descrições
                },
            };
    
            // Atualizar emptyFields para remover o campo do estado se ele for preenchido
            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };
    
                if (updatedData[field].required) {
                    if (Array.isArray(filesWithDescriptions)) {
                        // Verifica se o array de arquivos com descrições está vazio
                        if (filesWithDescriptions.length > 0) {
                            delete updatedEmptyFields[field];
                        }
                    } else if (filesWithDescriptions && filesWithDescriptions.trim()) {
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
                    if (value.length === 0) {
                        newEmptyFields[field] = true;
                    }
                } else if (!value || (typeof value === "string" && !value.trim())) {
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
                type: "error",
                title: "Erro.",
                message: "Por favor, preencha todos os campos obrigatórios.",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }
    
        try {
            // Upload dos arquivos "antes da manutenção"
            if (formData.filesBefore.value.length > 0) {
                await Promise.all(
                    formData.filesBefore.value.map((fileObj) =>
                        uploadFiles(
                            [fileObj], // Passa o array com o objeto { file, description }
                            programingId,
                            "antes",
                            fileObj.description // Envia a descrição
                        )
                    )
                );
            }
    
            // Upload dos arquivos "após a manutenção"
            if (formData.filesAfter.value.length > 0) {
                await Promise.all(
                    formData.filesAfter.value.map((fileObj) =>
                        uploadFiles(
                            [fileObj], // Passa o array com o objeto { file, description }
                            programingId,
                            "depois",
                            fileObj.description // Envia a descrição
                        )
                    )
                );
            }
    
            // Atualiza o status da Ordem de Serviço
            await updateOrderServiceStatus(orderServiceData.id, "Resolvido");
    
            setIsEditing(false);
            setIsSaved(true);
            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: "Dados da manutenção salvos com sucesso!",
            });
            setShowMessageBox(true);
    
            onMaintenanceSave(); // Notifica o componente pai que a manutenção foi salva
            setTimeout(() => setShowMessageBox(false), 1200);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro ao salvar.",
                message: "Ocorreu um erro ao salvar os dados da manutenção. Tente novamente.",
            });
            setShowMessageBox(true);
            console.error("Erro ao salvar manutenção:", error);
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            if (!programingId) return;
    
            try {
                const files = await getAllImages(programingId);
    
                // Separar arquivos "antes" e "depois" com base no `type`
                const filesBefore = files.filter((file) => file.type === "antes");
                const filesAfter = files.filter((file) => file.type === "depois");
    
                setFormData({
                    filesBefore: { value: filesBefore.map((f) => ({ file: f, description: f.description })), required: true },
                    filesAfter: { value: filesAfter.map((f) => ({ file: f, description: f.description })), required: true },
                });

                setIsEditing(false);
            } catch (error) {
                console.error("Erro ao buscar arquivos:", error);
            }
        };
    
        fetchFiles();
    }, [programingId]);
    
    
    
    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col bg-white rounded border border-gray-300 px-6 mb-2 mt-1.5 shadow-sm">
            <div className="flex justify-between rounded items-center py-4 cursor-pointer bg-white" onClick={toggleSection}>
                <h3 className="text-sm font-medium text-primary-light">Manutenção</h3>
                <span className="text-primary-light">{isOpen ? <IoIosRemoveCircleOutline size={25} /> : <IoIosAddCircleOutline size={25} />}</span>
            </div>


            <div className="mb-4">
                <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - antes da manutenção *</p>
                <InputUpload
                    label="Anexar arquivo(s)"
                    initialFiles={formData.filesBefore.value || []}
                    onFilesUpload={(filesWithDescriptions) => handleFieldChange("filesBefore")(filesWithDescriptions)} // Atualiza o estado
                    errorMessage={emptyFields.filesBefore ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div className="mb-4">
                <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - pós manutenção *</p>
                <InputUpload
                    label="Anexar arquivo(s)"
                    initialFiles={formData.filesAfter.value || []}
                    onFilesUpload={(filesWithDescriptions) => handleFieldChange("filesAfter")(filesWithDescriptions)} // Atualiza o estado
                    errorMessage={emptyFields.filesAfter ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div>
                {isSaved && <p className="mt-2 text-sm mb-3 text-gray-400">Enviado por: {user.name}</p>}
            </div>
            <div className="flex flex-col md:flex-row justify-end">
                <div className="flex flex-col pb-4 md:flex-row gap-y-1.5">
                    {orderServiceData.status !== "Finalizado" && isEditing && !isMaintenanceClosed ? (
                        <>
                            <ButtonSecondary onClick={() => setIsOpen(false)}>Cancelar</ButtonSecondary>
                            <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                        </>
                    ) : orderServiceData.status !== "Finalizado" && !isMaintenanceClosed ? (
                        <>
                            <ButtonSecondary onClick={() => setIsEditing(true)}>Editar</ButtonSecondary>
                            <ButtonPrimary onClick={handleClose}>Encerrar</ButtonPrimary>
                        </>
                    ) : null}
                </div>
            </div>
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


//