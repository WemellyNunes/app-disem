import { deleteDocument } from "../../utils/api/api";
import { useState } from "react";
import { FaTrash } from 'react-icons/fa';
import MessageBox from "../box/message";
import ConfirmationModal from "../modal/confirmation";


const DocumentList = ({ documents, onRemove }) => {
    const [loading, setLoading] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });

    if (documents.length === 0) {
        return null;
    }

    const handleConfirmDelete = (document) => {
        setSelectedDocument(document);
        setShowConfirmation(true);
    };

    const handleDelete = async () => {
        if (!selectedDocument) return;

        setLoading(selectedDocument.id);
        setShowConfirmation(false);

        try {
            await deleteDocument(selectedDocument.id);
            onRemove(selectedDocument.id);

            setMessageContent({ 
                type: 'success', 
                title: 'Sucesso', 
                message: 'Documento excluído com sucesso!' 
            });
            setShowMessageBox(true);
        } catch (error) {
            setMessageContent({ 
                type: 'error', 
                title: 'Erro', 
                message: 'Não foi possível excluir o documento.' 
            });
            setShowMessageBox(true);
        } finally {
            setLoading(null);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    return (
        <div className="mt-10 mb-8 border border-gray-300 p-6 rounded-lg">
            <h3 className="text-sm font-semibold mb-2 text-gray-800">Documentos Anexados:</h3>
            <ul className="list-disc p-2">
                {documents.map(doc => (
                    <div key={doc.id} className="flex justify-between items-center space-y-3">
                        <div className="flex items-center text-sm text-primary-light hover:text-blue-700 cursor-pointer">
                            <span>{doc.nameFile} ({(doc.size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => handleConfirmDelete(doc)}
                                className=" text-gray-700 bg-gray-300 p-2 rounded-full hover:text-primary-light hover:bg-gray-200"
                                disabled={loading === doc.id}
                            >
                                <FaTrash size={10} />
                            </button>
                        </div>
                    </div>
                
                ))}
            </ul>

            {showConfirmation && (
                <ConfirmationModal
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o documento ?`}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmation(false)}
                />
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

export default DocumentList;