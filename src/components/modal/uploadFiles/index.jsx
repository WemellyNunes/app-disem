import { useState, useEffect } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import ButtonSecondary from '../../buttons/buttonSecondary';
import { uploadDocument } from '../../../utils/api/api';
import MessageBox from '../../box/message';

const UploadModalFiles = ({ isOpen, onClose, orderId, onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState({ show: false, type: "", title: "", text: "" });

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
            setMessage({ show: true, type: "error", title: "Erro!", text: "Nenhuma OS foi salva ainda." });
            setTimeout(() => setMessage({ show: false }), 1500);
            return;
        }
    
        if (files.length === 0) {
            setMessage({ show: true, type: "warning", title: "Atenção!", text: "Selecione ao menos um arquivo para enviar." });
            setTimeout(() => setMessage({ show: false }), 1500);
            return;
        }
    
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("orderServiceId", orderId);
    
                await uploadDocument(formData);
            }

            setMessage({ show: true, type: "success", title: "Sucesso!", text: "Documentos enviados com sucesso." });
    
            setTimeout(() => {
                setMessage({ show: false });
                onUploadSuccess();
                onClose(); 
            }, 1500);
        } catch (error) {
            setMessage({ show: true, type: "error", title: "Erro!", text: "Não foi possível enviar os documentos." });
            setTimeout(() => setMessage({ show: false }), 1500);
        }
    };
    

    if (!isOpen) return null;

    return (
        <>
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
                {message.show && (
                    <MessageBox
                        type={message.type}
                        title={message.title}
                        message={message.text}
                        onClose={() => setMessage({ show: false })}
                    />
                )}
            </div>
        </>
    );
};

export default UploadModalFiles;
