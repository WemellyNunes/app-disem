import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import UploadModal from '../../modal/upload';
import PreviewFile from '../../modal/preview';
import ConfirmationModal from '../../modal/confirmation';
import MessageBox from '../../box/message';

import { updateImage, deleteImage, getImageUrl } from '../../../utils/api/api';

const InputUpload = ({ label, disabled, className, onFilesUpload, errorMessage, initialFiles, uploadType = "image", orderServiceId }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState(initialFiles || []);
    const [fileToEdit, setFileToEdit] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });


    useEffect(() => {
        const formattedFiles = (initialFiles || []).map((item) => ({
            id: item.id || item.file?.id,
            file: item.file || item,
            description: item.description || "",
        }));
        console.log("Arquivos formatados corrigidos:", formattedFiles);
        setUploadedFiles(formattedFiles);
    }, [initialFiles]);    


    const handleUpload = async (files, description) => {
        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`O arquivo "${file.name}" excede o limite de 5MB e não foi carregado.`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            try {
                const newFiles = validFiles.map((file) => {
                    return { file, description };
                });


                if (uploadType === "image") {
                    const updatedFiles = [...uploadedFiles, ...newFiles];
                    setUploadedFiles(updatedFiles);
                    await onFilesUpload(updatedFiles);
                } else {
                    console.error("Tipo de upload ou ID inválido.");
                }

                setShowModal(false);
            } catch (error) {
                console.error("Erro no upload:", error);
            }
        }
    };

    const handleDeleteFile = async () => {
        if (imageToDelete) {
            if (imageToDelete.id) {
                try {
                    await deleteImage(imageToDelete.id);

                    const updatedFiles = uploadedFiles.filter(
                        (file) => file.id !== imageToDelete.id
                    );
                    setUploadedFiles(updatedFiles);
                    onFilesUpload(updatedFiles);

                    setMessageContent({
                        type: "success",
                        title: "Sucesso!",
                        message: "Imagem deletada com sucesso!"
                    });
                } catch (error) {
                    console.error("Erro ao deletar imagem:", error);

                    setMessageContent({
                        type: "error",
                        title: "Erro!",
                        message: "Não foi possível deletar a imagem."
                    });
                }
            } else {
                const updatedFiles = uploadedFiles.filter(
                    (file) => file.file.name !== imageToDelete.file.name
                );
                setUploadedFiles(updatedFiles);
                onFilesUpload(updatedFiles);

                setMessageContent({
                    type: "info",
                    title: "Removido!",
                    message: "Imagem removida da lista."
                });
            }
            setShowConfirmModal(false);
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1200);
            setImageToDelete(null);
        }
    };

    const handlePreviewFile = (file) => {
        if (file?.content) {
            try {
                const byteCharacters = atob(file.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/png" });
                const fileUrl = URL.createObjectURL(blob);

                setPreviewFile({ url: fileUrl, type: "image/png" });
                setShowPreview(true);
            } catch (error) {
                console.error("Erro ao processar visualização:", error);
                alert("Erro ao exibir o arquivo.");
            }
        } else {
            alert("Conteúdo do arquivo não disponível para visualização.");
        }


    };


    const handleEditFile = async (file, description, index) => {
        const fileId = uploadedFiles[index]?.id; 
        console.log("Tentando editar a imagem:", file);
        console.log("Descrição:", description);
        console.log("ID da imagem:", fileId);
    
        if (!fileId) {
            console.error("ID da imagem não encontrado.");
            return;
        }
    
        const payload = {
            nameFile: file.name, 
            description: description || "", 
            observation: "Observação atualizada", 
        };
    
        try {
            console.log("Enviando payload:", payload);
            await updateImage(fileId, payload);
            console.log("Imagem atualizada com sucesso!");
    
            setUploadedFiles((prevFiles) =>
                prevFiles.map((item, i) =>
                    i === index ? { ...item, description } : item
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar a imagem:", error);
            if (error.response) {
                console.error("Resposta do servidor:", error.response.data);
            }
        }
    };
    


    const handleShowConfirmModal = (file) => {
        console.log("Arquivo selecionado para deletar:", file);
        setImageToDelete(file);
        setShowConfirmModal(true);
    };


    return (
        <div className={`flex flex-col mb-4`}>
            <label
                className={`flex items-center border border-dashed rounded-md p-4 cursor-pointer w-full 
                h-9 md:h-10 transition-colors duration-200 ${disabled ? ' border-gray-200 text-gray-400' : 'border-primary-light hover:bg-blue-50'} ${className}`}
                onClick={() => {
                    if (!disabled) {
                        setFileToEdit(null);
                        setShowModal(true);
                    }
                }}
            >
                <FaUpload className={`h-4 w-4 mr-3 ${disabled ? 'text-gray-400' : 'text-primary-light'}`} />
                <span className={`text-xs md:text-sm italic font-normal ${disabled ? 'text-gray-400' : 'text-primary-light'}`}>
                    {label}
                </span>
            </label>

            {uploadedFiles?.length > 0 && (
                <div className="w-full">
                    {uploadedFiles.map((item, index) => (
                        <div key={index} className={`flex justify-between items-center border rounded-md p-1.5 mt-1 ${disabled ? 'bg-gray-50 border-none' : 'border'}`}>
                            <div className="flex flex-col">
                                <span className={`text-xs md:text-sm font-light ${disabled ? 'text-gray-500' : 'text-primary-light'}`}>{item?.file?.name || "Arquivo não identificado"}</span>
                                <span className="text-xs text-gray-500">
                                    {item?.file?.size
                                        ? (item.file.size / 1024 / 1024).toFixed(2) + " MB" // Arquivo local
                                        : ((item?.file?.content.length * 3) / 4 / 1024 / 1024).toFixed(2) + " MB" // Arquivo salvo
                                    }
                                </span>
                                <span className="text-xs text-gray-500">Descrição: {item?.description || "Sem descrição"}</span>
                            </div>
                            <div className="flex">
                                {item?.id && ( // Apenas mostra os botões se a imagem tiver um ID (salva no backend)
                                    <>
                                        <button
                                            onClick={() => handlePreviewFile(item?.file)}
                                            className={`text-primary-light text-xs md:text-sm mr-2`}
                                        >
                                            <FaEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditFile(item.file, item.description, index)}
                                            className={`text-primary-light hidden text-xs md:text-sm mr-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={disabled}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleShowConfirmModal(item)}
                                    className={`text-primary-light ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={disabled}
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <UploadModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setFileToEdit(null);
                }}
                onUpload={handleUpload}
                initialFiles={fileToEdit ? [fileToEdit.file] : []}
                initialDescription={fileToEdit ? fileToEdit.description : ""}
                editIndex={fileToEdit ? fileToEdit.index : null}
            />

            {showPreview && (
                <PreviewFile
                    file={previewFile}
                    onClose={() => setShowPreview(false)}
                />
            )}
            {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}

            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}

            {showConfirmModal && (
                <ConfirmationModal
                    title="Excluir Imagem"
                    message="Tem certeza de que deseja excluir esta imagem? Esta ação não pode ser desfeita."
                    onConfirm={handleDeleteFile} // Confirma a exclusão
                    onCancel={() => {
                        setShowConfirmModal(false); // Fecha o modal
                        setImageToDelete(null);    // Limpa o estado
                    }}
                />

            )}

        </div>
    );
};

export default InputUpload;
