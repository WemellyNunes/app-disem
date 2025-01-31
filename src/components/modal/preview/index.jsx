import ButtonPrimary from "../../buttons/buttonPrimary";

const PreviewFile = ({ file, onClose }) => {
    if (!file || !file.url) {
        return null; // Se não houver arquivo, não renderiza nada
    }
    
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    console.log("Visualizando arquivo:", file);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full mx-1.5 md:mx-0 md:w-1/2">
                <h2 className="text-sm md:text-base font-semibold mb-4">Pré-visualização do arquivo</h2>
                {isImage && <img src={file.url} alt="Pré-visualização" className="w-full h-[550px]" />}
                {isPdf && (
                    <iframe
                        src={file.url}
                        title="Pré-visualização do PDF"
                        className="w-full h-96"
                    />
                )}
                {!isImage && !isPdf && (
                    <p className="text-center">Formato não suportado para visualização.</p>
                )}
                <div className="flex justify-end mt-4">
                    <ButtonPrimary onClick={onClose}>
                        Fechar
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
};


export default PreviewFile;

