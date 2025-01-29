import { useState, useEffect } from "react";
import InputUpload from "../../inputs/inputUpload";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import MessageBox from "../../box/message";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { useUser } from "../../../contexts/user";

import { updateOrderServiceStatus, uploadFiles, getAllImages } from "../../../utils/api/api";

const MaintenanceSection = ({ orderServiceData, onMaintenanceClose, onMaintenanceSave }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isMaintenanceClosed, setIsMaintenanceClosed] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isAdvancing, setIsAdvancing] = useState(false);

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

    const handleAdvance = () => {
        window.location.reload();  
    };

    const handleEdit = () => {
        setIsEditing(true);    
        setIsAdvancing(true);   
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
                    value: filesWithDescriptions, 
                },
            };
            setEmptyFields((prevEmptyFields) => {
                const updatedEmptyFields = { ...prevEmptyFields };

                if (updatedData[field].required) {
                    if (Array.isArray(filesWithDescriptions)) {
                       
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
            if (formData.filesBefore.value.length > 0) {
                const uploadedFilesBefore = await Promise.all(
                    formData.filesBefore.value.map(async (fileObj) => {
                        const response = await uploadFiles(
                            [fileObj], 
                            programingId,
                            "antes",
                            fileObj.description,
                            new Date().toISOString()
                        );

                        return {
                            id: response.id, 
                            file: fileObj.file,
                            description: fileObj.description,
                            createdAt: new Date().toISOString().split("T")[0]
                        };
                    })
                );
                setFormData((prevData) => ({
                    ...prevData,
                    filesBefore: {
                        ...prevData.filesBefore,
                        value: uploadedFilesBefore, 
                    },
                }));
            }

            if (formData.filesAfter.value.length > 0) {
                const uploadedFilesAfter = await Promise.all(
                    formData.filesAfter.value.map(async (fileObj) => {
                        const response = await uploadFiles(
                            [fileObj], 
                            programingId,
                            "depois",
                            fileObj.description,
                            new Date().toISOString()
                        );

                        return {
                            id: response.id, 
                            file: fileObj.file,
                            description: fileObj.description,
                            createdAt: new Date().toISOString().split("T")[0]
                        };
                    })
                );
                setFormData((prevData) => ({
                    ...prevData,
                    filesAfter: {
                        ...prevData.filesAfter,
                        value: uploadedFilesAfter, 
                    },
                }));
            }
            await updateOrderServiceStatus(orderServiceData.id, "Atendida");

            setIsEditing(false);
            setIsSaved(true);
            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: "Dados da manutenção salvos com sucesso!",
            });
            setShowMessageBox(true);

            onMaintenanceSave();
            setTimeout(() => setShowMessageBox(false), 1500);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro ao salvar.",
                message: "Ocorreu um erro ao salvar os dados da manutenção. Tente novamente.",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            console.error("Erro ao salvar manutenção:", error);
        }
    };

    useEffect(() => {
        const fetchFiles = async () => {
            if (!programingId) return;

            try {
                const files = await getAllImages(programingId);
                const filesBefore = files.filter((file) => file.type === "antes");
                const filesAfter = files.filter((file) => file.type === "depois");

                setFormData({
                    filesBefore: {
                        value: filesBefore.map((f) => ({
                            id: f.id,
                            file: {
                                name: f.nameFile,
                                content: f.content, 
                                description: f.description
                            },
                            description: f.description,
                        })),
                        required: true
                    },
                    filesAfter: {
                        value: filesAfter.map((f) => ({
                            id: f.id,
                            file: {
                                name: f.nameFile,
                                content: f.content, 
                                description: f.description
                            },
                            description: f.description,
                        })),
                        required: true
                    }
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
        <div className="flex flex-col bg-white rounded-xl border border-gray-300 px-6 mb-4 mt-1.5 shadow-sm">
            <div className="flex justify-between rounded  py-4 cursor-pointer bg-white mb-3" onClick={toggleSection}>
                <div className="flex flex-col gap-y-1">
                    <h3 className="text-sm md:text-base font-medium text-gray-800">Manutenção</h3>
                    <p className="text-sm text-primary-dark">Adicione as imagens da manutenção realizada nos campos indicados abaixo.</p>
                </div>
                <span className="text-primary-light">{isOpen ? <IoIosRemoveCircleOutline size={25} /> : <IoIosAddCircleOutline size={25} />}</span>
            </div>


            <div className="mb-4 w-full">
                <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - antes da manutenção *</p>
                <InputUpload
                    label="Anexar arquivo(s)"
                    initialFiles={formData.filesBefore.value || []}
                    onFilesUpload={(filesWithDescriptions) => handleFieldChange("filesBefore")(filesWithDescriptions)} 
                    errorMessage={emptyFields.filesBefore ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div className="mb-4 w-full">
                <p className="text-xs md:text-sm text-primary-dark mb-2">Imagens - pós manutenção *</p>
                <InputUpload
                    label="Anexar arquivo(s)"
                    initialFiles={formData.filesAfter.value || []}
                    onFilesUpload={(filesWithDescriptions) => handleFieldChange("filesAfter")(filesWithDescriptions)} 
                    errorMessage={emptyFields.filesAfter ? "Este campo é obrigatório" : ""}
                    disabled={!isEditing}
                />
            </div>
            <div>
                {isSaved && <p className="mt-2 text-sm mb-3 text-gray-400">Enviado por: {user.name}</p>}
            </div>
            <div className="flex flex-col md:flex-row justify-end">
                <div className="flex flex-col md:flex-row justify-end pb-4 gap-y-1.5">
                    {!isMaintenanceClosed && orderServiceData.status !== "Finalizado" ? (
                        isEditing && !isAdvancing ? (
                            <>
                                <ButtonSecondary onClick={() => setIsOpen(false)}>Cancelar</ButtonSecondary>
                                <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                            </>
                        ) : isAdvancing ? (
                            <>
                                <ButtonSecondary onClick={() => setIsEditing(false)}>Cancelar</ButtonSecondary>
                                <ButtonPrimary onClick={handleAdvance}>Avançar</ButtonPrimary>
                            </>
                        ) : (
                            <>
                                <ButtonSecondary onClick={handleEdit}>Ativar edição</ButtonSecondary>
                                <ButtonPrimary onClick={handleClose}>Encerrar</ButtonPrimary>
                            </>
                        )
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