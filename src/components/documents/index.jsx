import { deleteDocument } from "../../utils/api/api";
import { useState } from "react";
import ButtonSecondary from "../buttons/buttonSecondary";

const DocumentList = ({ documents, onRemove }) => {
    const [loading, setLoading] = useState(null);

    if (documents.length === 0) {
        return null; // Não exibe nada se não houver documentos
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja remover este documento?")) {
            return;
        }

        setLoading(id);
        try {
            await deleteDocument(id); 
            onRemove(id); 
        } catch (error) {
            console.error("❌ Erro ao excluir documento:", error);
            alert("Erro ao excluir o documento. Tente novamente.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="mt-10 border p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Documentos Anexados:</h3>
            <ul className="list-disc pl-4">
                {documents.map(doc => (
                    <li key={doc.id} className="flex justify-between items-center">
                        <span>{doc.nameFile} ({(doc.size / 1024).toFixed(2)} KB)</span>
                        <ButtonSecondary
                            onClick={() => handleDelete(doc.id)}
                            disabled={loading === doc.id}
                        >
                            {loading === doc.id ? "Removendo..." : "Remover"}
                        </ButtonSecondary>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;
