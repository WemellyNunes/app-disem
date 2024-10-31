import { useState, useEffect } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import ButtonSecondary from '../../buttons/buttonSecondary';

const UploadModal = ({ isOpen, onClose, onUpload, initialFiles = [], initialDescription = "", editIndex = null }) => {
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFiles(initialFiles);
            setDescription(initialDescription);
        }
    }, [isOpen, initialFiles, initialDescription]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files).filter(file =>
            file.type === 'application/pdf' ||
            file.type === 'image/png' ||
            file.type === 'image/jpeg'
        );
        setFiles(selectedFiles);
    };

    const handleUpload = () => {
        if (files.length > 0) {
            onUpload(files, description, editIndex);
            setFiles([]);
            setDescription("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg mx-2 md:mx-0 w-full md:w-1/3">
                <h2 className="text-base md:text-xl font-medium text-primary-light mb-4">Selecione os arquivos</h2>
                <div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf, .png, .jpg, .jpeg"
                        multiple
                        className="mb-2"
                    />
                </div>
                <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border rounded-md py-4 md:py-2 px-2 w-full mb-4 "
                />
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

export default UploadModal;