import { useState, useEffect } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import ButtonSecondary from '../../buttons/buttonSecondary';
import { uploadDocument } from '../../../utils/api/api';

const UploadModalFiles = ({ isOpen, onClose, orderId, onUploadSuccess }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setFiles([]); 
        }
    }, [isOpen]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files).filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'image/png' ||
            file.type === 'image/jpeg'
        );

        setFiles(prevFiles => [...prevFiles, ...selectedFiles]); 
    };

    const handleUpload = async () => {
        if (!orderId) {
            alert("Erro: Nenhuma OS foi salva ainda.");
            return;
        }

        if (files.length === 0) {
            alert("Selecione ao menos um arquivo para fazer o upload.");
            return;
        }

        try {
            console.log(`📂 Iniciando upload de ${files.length} arquivos para a OS ID: ${orderId}`);

            const uploadedFiles = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("orderServiceId", orderId);

                const response = await uploadDocument(formData);
                console.log("✅ Documento carregado com sucesso:", response);

                uploadedFiles.push({
                    id: response.id, // Supondo que o backend retorna um ID do documento
                    name: file.name,
                });
            }

            console.log("🎉 Todos os documentos foram enviados com sucesso.");
            onUploadSuccess(uploadedFiles); // Atualiza a lista de documentos na tela principal
            setFiles([]);
            onClose();
        } catch (error) {
            console.error("❌ Erro ao fazer upload dos documentos:", error);
            alert("Erro ao enviar os documentos.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg mx-2 md:mx-0 w-full md:w-1/3">
                <h2 className="text-sm md:text-base font-medium text-primary-light mb-4">Anexar Documentos</h2>
                <div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf, .png, .jpg, .jpeg"
                        multiple
                        className="mb-2"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-y-1.5 justify-end">
                    <ButtonSecondary onClick={onClose}>
                        Cancelar
                    </ButtonSecondary>
                    <ButtonPrimary onClick={handleUpload}>
                        Salvar
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
};

export default UploadModalFiles;
