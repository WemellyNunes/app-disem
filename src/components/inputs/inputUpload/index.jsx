import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import UploadModal from '../../modal/upload';
import PreviewFile from '../../modal/preview';
import ConfirmationModal from '../../modal/confirmation';
import MessageBox from '../../box/message';


import { updateImage, uploadDocument, deleteImage } from '../../../utils/api/api';

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
        const formattedFiles = initialFiles.map((item) => ({
            id: item.id || item.file?.id, // Garante o ID correto
            file: item.file || item,     // Normaliza o objeto
            description: item.description || "",
        }));
        console.log("Arquivos formatados corrigidos:", formattedFiles);
        setUploadedFiles(formattedFiles || []);
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
                const newFiles = validFiles.map((file) => ({ file, description }));
                
                if (uploadType === "image") {
                    // Atualiza o estado acumulando os arquivos
                    const updatedFiles = [...uploadedFiles, ...newFiles];
                    setUploadedFiles(updatedFiles);
                    await onFilesUpload(updatedFiles); // Passa todos os arquivos
                } else if (uploadType === "document" && orderServiceId) {
                    for (const file of validFiles) {
                        const response = await uploadDocument(file, orderServiceId);
                        console.log("Documento carregado com sucesso:", response);
                        setUploadedFiles((prevFiles) => [
                            ...prevFiles,
                            { file, description, id: response.id },
                        ]);
                    }
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
        console.log("Tentando deletar arquivo:", imageToDelete);
    
        if (imageToDelete) {
            if (imageToDelete.id) {
                // Caso o arquivo já tenha sido salvo (possui ID)
                try {
                    await deleteImage(imageToDelete.id); // Exclui no backend
        
                    // Atualiza a lista removendo o arquivo
                    const updatedFiles = uploadedFiles.filter(
                        (file) => file.id !== imageToDelete.id
                    );
                    setUploadedFiles(updatedFiles);
                    onFilesUpload(updatedFiles); // Atualiza o componente pai
    
                    // Mostra mensagem de sucesso
                    setMessageContent({
                        type: "success",
                        title: "Sucesso!",
                        message: "Imagem deletada com sucesso!"
                    });
                } catch (error) {
                    console.error("Erro ao deletar imagem:", error);
    
                    // Mensagem de erro
                    setMessageContent({
                        type: "error",
                        title: "Erro!",
                        message: "Não foi possível deletar a imagem."
                    });
                }
            } else {
                // Caso o arquivo ainda não tenha sido salvo (sem ID)
                const updatedFiles = uploadedFiles.filter(
                    (file) => file.file.name !== imageToDelete.file.name
                );
                setUploadedFiles(updatedFiles);
                onFilesUpload(updatedFiles); // Atualiza o componente pai
    
                // Mensagem de sucesso para exclusão local
                setMessageContent({
                    type: "info",
                    title: "Removido!",
                    message: "Imagem removida da lista."
                });
            }
    
            // Fecha o modal e exibe a mensagem
            setShowConfirmModal(false);
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1200);
            setImageToDelete(null); // Reseta o estado
        }
    };
    
    

    const handlePreviewFile = (file) => {
        if (file?.content) {
            try {
                // Decodifica Base64 para criar Blob
                const byteCharacters = atob(file.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/png" }); // Ajuste o tipo conforme necessário
                const fileUrl = URL.createObjectURL(blob);
    
                // Passa o URL e tipo para o modal
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
        if (!fileId) {
            console.log("id não encontrado");
            return;
        }
    
        const payload = {
            nameFile: file.name,
            description: description || "",
            observation: "Observação atualizada", 
        };
    
        try {
            await updateImage(fileId, payload);
            console.log("Imagem atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar a imagem:", error);
        }
    };
    
    const handleShowConfirmModal = (file) => {
        console.log("Arquivo selecionado para deletar:", file); // Verifica o objeto clicado
        setImageToDelete(file); // Armazena o arquivo para exclusão
        setShowConfirmModal(true); // Abre o modal
    };
    
    
    
    
    return (
        <div className={`flex flex-col mb-4`}>
            <label
                className={`flex items-center border border-dashed rounded-md p-4 cursor-pointer w-full 
                h-9 md:h-10 transition-colors duration-200 ${disabled ? 'bg-primary-gray border-gray-50 text-gray-400' : 'border-primary-light hover:bg-blue-50'} ${className}`}
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
                                <span className="text-xs text-gray-500"> {(item?.file?.size / 1024 / 1024).toFixed(2) || "Tamanho não disponível"} MB</span>
                                <span className="text-xs text-gray-500">Descrição: {item?.description || "Sem descrição"}</span>
                            </div>
                            <div className="flex">
                                <button
                                    onClick={() => handlePreviewFile(item?.file)}
                                    className={`text-blue-500 text-xs md:text-sm mr-2`}
                                >
                                    <FaEye size={18} />
                                </button>
                                <button
                                    onClick={() => handleEditFile(item.file, item.description, index)}
                                    className={`text-green-500 text-xs md:text-sm mr-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={disabled}
                                >
                                    <FaEdit size={16} />
                                </button>
                                <button
                                    onClick={() => handleShowConfirmModal(item)}
                                    className={`text-red-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
