import ButtonPrimary from "../../buttons/buttonPrimary";

const PreviewFile = ({ file, onClose }) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full mx-1.5 md:mx-0 md:w-1/2 ">
                <h2 className="text-sm md:text-base font-semibold mb-4">Pré-visualização do arquivo</h2>
                {isImage && <img src={URL.createObjectURL(file)} alt="Pré-visualização" className="w-full h-96" />}
                {isPdf && (
                    <iframe 
                        src={URL.createObjectURL(file)} 
                        title="Pré-visualização do PDF"
                        className="w-full h-96"
                    />
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
