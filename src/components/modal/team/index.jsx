import { useState } from 'react'
import InputPrimary from '../../inputs/inputPrimary'
import ButtonPrimary from '../../buttons/buttonPrimary'
import ButtonSecondary from '../../buttons/buttonSecondary'
import MessageBox from "../../box/message"

import { createTeam } from '../../../utils/api/api'

const TeamModal = ({onClose}) => {

    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });


    const [formData, setFormData] = useState({
        nome: {value: '', required: true},
        cargo: {value: '', required: true}
    })

    const handleFieldChange = (field) => (value) => {
        setFormData((prevData) => {
          const updatedData = {
            ...prevData,
            [field]: { ...prevData[field], value },
          };
    
          if (updatedData[field].required && value.trim()) {
            setEmptyFields((prevEmptyFields) => {
              const updatedEmptyFields = { ...prevEmptyFields };
              delete updatedEmptyFields[field];
              return updatedEmptyFields;
            });
          }
          return updatedData;
        });
    };

    const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
          const { value, required } = formData[field];
          if (required && (!value || value.trim() === "")) {
            newEmptyFields[field] = true;
          }
        });
    
        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            setMessageContent({ 
                type: "error", 
                title: "Erro.", 
                message: "Preencha todos os campos obrigatórios." 
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1000);
            return;
        }
    
        const teamData = {
            nome: formData.nome.value,
            cargo: formData.cargo.value,
        };
    
        try {
            const response = await createTeam(teamData); // Chama o endpoint para salvar
            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: "Profissional cadastrado com sucesso!"
            });
            setShowMessageBox(true);
            setTimeout(() => {
                setShowMessageBox(false);
                onClose(); // Fecha o modal após salvar
            }, 1000);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro.",
                message: "Não foi possível salvar o profissional."
            });
            setShowMessageBox(true);
            console.error("Erro ao salvar profissional:", error);
        }
    };
    



    return (
        <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className='bg-white p-6 rounded-md shadow-md w-96'>
                <h2>Cadastrar profissional</h2>
                    <div>
                        <InputPrimary
                            label="Nome"
                            placeholder="Nome do profissional"
                            value={formData.nome.value}
                            onChange={(e) => handleFieldChange('nome')(e.target.value)}
                            errorMessage={emptyFields.nome ? "Este campo é obrigatório" : ""}
                        />

                        <InputPrimary
                            label="Cargo"
                            placeholder="Escreva o cargo"
                            value={formData.cargo.value}
                            onChange={(e) => handleFieldChange('cargo')(e.target.value)}
                            errorMessage={emptyFields.cargo ? "Este campo é obrigatório" : ""}
                        />
                    </div>
                <div className="flex justify-center mt-8">
                    <ButtonSecondary onClick={onClose}>Cancelar</ButtonSecondary>
                    <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
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
    
    
        </>
    )
}

export default TeamModal;