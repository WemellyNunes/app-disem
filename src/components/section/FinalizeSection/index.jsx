import { useState } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import MessageBox from '../../box/message';
import InputPrimary from '../../inputs/inputPrimary';

const FinalizeSection = () => {
    const [finalObservation, setFinalObservation] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [isError, setIsError] = useState(false);

    const handleFieldChange = (value) => {
        setFinalObservation(value); 
        if (isError) setIsError(false); 
    };

    
    const validateFields = () => {
        return finalObservation.trim() !== '';
    };

    const handleSave = () => {
        if (!validateFields()) {
            setIsError(true); 
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Este campo é obrigatório.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        setIsSaved(true);
        setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Finalizado com sucesso!' });
        setShowMessageBox(true);
        setTimeout(() => setShowMessageBox(false), 1500);
    };
    
    let colorBorder = isError ? 'border-primary-red' : '';

    return (
        <div className="flex flex-col bg-white rounded mb-2 mt-2 shadow">
            <div className="px-4 md:px-6 py-4">
                <h3 className="text-sm md:text-base font-normal text-primary-light">Finalização da OS</h3>
                <div className="mt-4">
                    <InputPrimary
                        label="Observação final *"
                        placeholder="Escreva uma observação para finalizar a ordem de serviço"
                        value={finalObservation}
                        onChange={handleFieldChange}
                        disabled={isSaved} 
                        className={`${colorBorder} border rounded`} 
                    />
                </div>
                <div className="flex justify-end mt-4">
                    {!isSaved ? ( 
                        <ButtonPrimary onClick={handleSave}>
                            Finalizar
                        </ButtonPrimary>
                    ) : (
                        <ButtonPrimary>
                            Exportar Relatório
                        </ButtonPrimary>
                    )}
                </div>
            </div>

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

export default FinalizeSection;
