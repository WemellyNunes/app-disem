import { useState, useEffect } from "react";
import InputUpload from "../../inputs/inputUpload";
import InputPrimary from "../../inputs/inputPrimary";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import MessageBox from "../../box/message";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { useUser } from "../../../contexts/user";
import { uploadImage, getAllImages, updateOrderServiceStatus } from "../../../utils/api/api";


const MaintenanceSection = ({ orderServiceData, onMaintenanceClose, onMaintenanceSave }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
        onMaintenanceClose(true);
    };

    const [formData, setFormData] = useState({
        observation: { value: "", required: false },
        filesBefore: { value: [], required: true },
        filesAfter: { value: [], required: true },
    });

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

    const handleFileUpload = async (files, type) => {
        if (!programingId) {
            setMessageContent({ type: "error", title: "Erro", message: "ID da programação não encontrado." });
            setShowMessageBox(true);
            return;
        }
    
        try {
            setIsUploading(true);
    
            for (const item of files) {
                const { file, description } = item;
                await uploadImage(file, programingId, description || `Imagem ${type}`, formData.observation.value);
            }
    
            // Atualiza o estado com os arquivos enviados
            setFormData((prevData) => ({
                ...prevData,
                [type === "antes" ? "filesBefore" : "filesAfter"]: { 
                    ...prevData[type === "antes" ? "filesBefore" : "filesAfter"],
                    value: files, // Atualiza o valor dos arquivos no estado
                },
            }));
    
            setMessageContent({
                type: "success",
                title: "Upload realizado",
                message: `As imagens (${type}) foram enviadas com sucesso!`,
            });
        } catch (error) {
            console.error("Erro no upload de imagens:", error);
            setMessageContent({
                type: "error",
                title: "Erro no upload",
                message: "Não foi possível enviar as imagens. Tente novamente.",
            });
        } finally {
            setIsUploading(false);
            setShowMessageBox(true);
        }
    };

    const handleSave = async () => {
        if (!validateFields()) {
            setMessageContent({
                type: 'error',
                title: 'Erro.',
                message: 'Por favor, preencha todos os campos obrigatórios.',
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }
    
        try {
            // Verifica se há arquivos para upload (antes e depois)
            if (formData.filesBefore.value.length > 0) {
                await handleFileUpload(formData.filesBefore.value, "antes");
            }
    
            if (formData.filesAfter.value.length > 0) {
                await handleFileUpload(formData.filesAfter.value, "depois");
            }

            await updateOrderServiceStatus(orderServiceData.id, "Resolvido")
    
            setIsEditing(false);
            setIsSaved(true);
            setMessageContent({
                type: 'success',
                title: 'Sucesso.',
                message: 'Dados da manutenção salvos com sucesso!',
            });
            setShowMessageBox(true);
    
            onMaintenanceSave(); // Notifica o pai que a manutenção foi salva
            setTimeout(() => setShowMessageBox(false), 1200);
        } catch (error) {
            setMessageContent({
                type: 'error',
                title: 'Erro ao salvar.',
                message: 'Ocorreu um erro ao salvar os dados da manutenção. Tente novamente.',
            });
            setShowMessageBox(true);
            console.error("Erro ao salvar manutenção:", error);
        }
    };
    
    const loadMaintenanceData = async () => {
        if (!programingId) {
            console.warn("Programing ID não definido. Aguardando atualização...");
            return;
        }
    
        try {
            const images = await getAllImages(); 
            const relatedImages = images.filter(img => img.programing.id === programingId); 
    
            // Ajuste os dados para garantir a estrutura necessária
            const filesBefore = relatedImages
                .filter(img => img.description.includes("antes"))
                .map(img => ({
                    file: { name: img.nameFile || "Arquivo sem nome" },
                    description: img.description || "",
                    id: img.id, // Certifique-se de que img.id existe
                }));


            const filesAfter = relatedImages
                .filter(img => img.description.includes("depois"))
                .map(img => ({
                    file: { name: img.nameFile || "Arquivo sem nome" }, 
                    description: img.description || "",
                    id: img.id,
                }));

                
                setFormData((prevData) => ({
                    ...prevData,
                    filesBefore: { ...prevData.filesBefore, value: filesBefore },
                    filesAfter: { ...prevData.filesAfter, value: filesAfter },
                    observation: { ...prevData.observation, value: relatedImages[0]?.observation || "" }, // Observação da primeira imagem
                }));
                
            const isDataSaved = filesBefore.length > 0 || filesAfter.length > 0;
            setIsEditing(!isDataSaved);
            setIsSaved(isDataSaved);
        } catch (error) {
            console.error("Erro ao carregar os dados da manutenção:", error);
            setMessageContent({
                type: "error",
                title: "Erro ao carregar",
                message: "Não foi possível carregar os dados da manutenção.",
            });
            setShowMessageBox(true);
        }
    };
    
    useEffect(() => {
        loadMaintenanceData();
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
                    onFilesUpload={(files) => handleFieldChange("filesBefore")(files)} // Atualiza o estado
                    errorMessage={emptyFields.filesBefore ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div className="mb-4">
                <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - pós manutenção *</p>
                <InputUpload
                    label="Anexar arquivo(s)"
                    initialFiles={formData.filesAfter.value || []}
                    onFilesUpload={(files) => handleFieldChange("filesAfter")(files)} // Atualiza o estado
                    errorMessage={emptyFields.filesAfter ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <InputPrimary
                    label="Observação"
                    placeholder="Escreva uma observação (opcional)"
                    value={formData.observation.value || 'sem observação'}
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