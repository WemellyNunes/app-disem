import { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import UploadModal from '../../modal/upload';
import PreviewFile from '../../modal/preview';

import { updateImage } from '../../../utils/api/api';

const InputUpload = ({ label, disabled, className, onFilesUpload, errorMessage, initialFiles }) => {
    const [showModal, setShowModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState(initialFiles || []);
    const [fileToEdit, setFileToEdit] = useState(null);

    useEffect(() => {
        setUploadedFiles(initialFiles || []);
    }, [initialFiles]);


    const handleUpload = (files, description, editIndex = null) => {
        const newFiles = files.map(file => ({
            file,
            description,
            id: editIndex !== null ? uploadedFiles[editIndex]?.id : null, // Mantém o ID original
        }));
    
        setUploadedFiles((prev) => {
            const updatedFiles = editIndex !== null
                ? prev.map((item, index) => (index === editIndex ? newFiles[0] : item))
                : [...prev, ...newFiles];
    
            onFilesUpload(updatedFiles); // Notifica o componente pai
            return updatedFiles;
        });
        setShowModal(false);
        setFileToEdit(null);
    };
       

    const handleRemoveFile = (fileToRemove) => {
        if (disabled) return;
        setUploadedFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((item) => item.file.name !== fileToRemove.file.name);
            onFilesUpload(updatedFiles); // Atualiza o estado no componente pai
            return updatedFiles;
        });
    };

    const handlePreviewFile = (file) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const handleEditFile = async (file, description, index) => {
        const fileId = uploadedFiles[index]?.id; // Pegue o ID do array principal
        if (!fileId) {
            console.log("id não encontrado");
            return;
        }
    
        const payload = {
            nameFile: file.name,
            description: description || "",
            observation: "Observação atualizada", // Ajuste conforme necessário
        };
    
        try {
            await updateImage(fileId, payload);
            console.log("Imagem atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar a imagem:", error);
        }
    };
    
    
    

    return (
        <div className={`flex flex-col mb-4`}>
            <label
                className={`flex items-center border border-dashed rounded-md p-4 cursor-pointer w-full md:w-2/4 
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
                <div className="w-full md:w-2/4">
                    {uploadedFiles.map((item, index) => (
                        <div key={index} className={`flex justify-between items-center border rounded-md p-1.5 mt-1 ${disabled ? 'bg-gray-50 border-none' : 'border'}`}>
                            <div className="flex flex-col">
                                <span className={`text-xs md:text-sm font-light ${disabled ? 'text-gray-500' : 'text-primary-light'}`}>{item?.file?.name || "Arquivo não identificado"}</span>
                                <span className="text-xs text-gray-500"> {(item?.file?.size / 1024).toFixed(2) || "Tamanho não disponível"} KB</span>
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
                                    onClick={() => handleRemoveFile(item.file)}
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
                onUpload={(files, description) => handleUpload(files, description, fileToEdit?.index)}
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
        </div>
    );
};

export default InputUpload;
