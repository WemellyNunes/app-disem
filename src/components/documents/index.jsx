import { deleteDocument, getDocumentBase64 } from "../../utils/api/api";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import MessageBox from "../box/message";
import ConfirmationModal from "../modal/confirmation";
import PreviewFile from "../modal/preview";

const DocumentList = ({ documents, onRemove, isReadOnly = false }) => {
    const [loading, setLoading] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });

    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);

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
                type: "success",
                title: "Sucesso",
                message: "Documento excluído com sucesso!",
            });
            setShowMessageBox(true);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro",
                message: "Não foi possível excluir o documento.",
            });
            setShowMessageBox(true);
        } finally {
            setLoading(null);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    const handlePreviewFile = async (doc) => {
        console.log("📂 Documento recebido:", doc);
    
        if (!doc.fileUrl) {
            setMessageContent({
                type: "error",
                title: "Erro",
                message: "O documento não possui um link válido.",
            });
            setShowMessageBox(true);
            return;
        }
    
        try {
            const response = await getDocumentBase64(doc.fileUrl.split("/").pop());
    
            setPreviewData({
                url: `data:${response.contentType};base64,${response.content}`,
                type: response.contentType,
            });
    
            setShowPreview(true);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro",
                message: "Não foi possível carregar a visualização do documento.",
            });
            setShowMessageBox(true);
        }
    };
    
    return (
        <div className="mt-10 mb-8 border border-gray-300 p-6 rounded-lg">
            <h3 className="md:text-base text-sm font-semibold mb-2 text-gray-800">Arquivos anexados</h3>
            <ul className="list-disc p-2">
                {documents.map((doc, index) => (
                    <div key={doc.id} className="flex justify-between items-center">
                        <div
                            className="flex items-center text-sm py-1.5 text-primary-dark hover:text-primary-light cursor-pointer"
                            onClick={() => handlePreviewFile(doc)} 
                        >
                            <span>{`${index + 1}. ${doc.nameFile ? doc.nameFile.split("/").pop() : "Nome do arquivo não disponível"}`}</span>
                        </div>
                        <div className="flex items-center py-1.5">
                            <button
                                onClick={() => handleConfirmDelete(doc)}
                                className={`text-gray-700 bg-gray-300 p-2 rounded-full hover:text-primary-light hover:bg-gray-200 ${isReadOnly ? 'hidden' : ''}`}
                                disabled={loading === doc.id || isReadOnly}
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

            {showPreview && (
                <PreviewFile
                    file={previewData}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default DocumentList;
