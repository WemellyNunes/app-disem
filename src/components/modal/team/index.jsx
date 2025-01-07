import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa';
import InputPrimary from '../../inputs/inputPrimary'
import ButtonPrimary from '../../buttons/buttonPrimary'
import ButtonSecondary from '../../buttons/buttonSecondary'
import MessageBox from "../../box/message"
import RadioInput from '../../inputs/radioInput';

import { createTeam, updateTeam } from '../../../utils/api/api'

const TeamModal = ({ onClose, teamData = null }) => {

    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [isDisabled, setIsDisabled] = useState(false);


    const [formData, setFormData] = useState({
        nome: { value: '', required: true },
        cargo: { value: '', required: true },
        status: { value: 'ATIVO', required: false}
    })

    const [isEditing, setIsEditing] = useState(false);

    const options = [
        { label: 'ATIVO', value: 'ATIVO' },
        { label: 'FERIAS', value: 'FERIAS' },
    ];

    useEffect(() => {
        // Preenche os campos ao editar
        if (teamData) {
            setIsEditing(true);
            setFormData({
                nome: { value: teamData.name, required: true },
                cargo: { value: teamData.role, required: true },
                status: { value: teamData.status || 'ATIVO', required: false }
            });
        }
    }, [teamData]);

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

        setIsDisabled(true)

        const teamPayload = {
            name: formData.nome.value,
            role: formData.cargo.value,
            status: formData.status.value,
            created_at: new Date().toISOString().split("T")[0]
        };

        try {
            if (isEditing) {
                await updateTeam(teamData.id, teamPayload); // Atualiza
                setMessageContent({
                    type: "success",
                    title: "Sucesso.",
                    message: "Profissional atualizado com sucesso!"
                });
            } else {
                await createTeam(teamPayload); // Cria novo
                setMessageContent({
                    type: "success",
                    title: "Sucesso.",
                    message: "Profissional cadastrado com sucesso!"
                });
            }

            setShowMessageBox(true);
            setTimeout(() => {
                setShowMessageBox(false);
                onClose(); // Fecha o modal
            }, 1000);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro.",
                message: "Não foi possível salvar o profissional."
            });
            setShowMessageBox(true);
            setIsDisabled(false)
            console.error("Erro:", error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className='bg-white p-6 rounded-md shadow-md w-96'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='font-medium text-primary-light'>
                            {isEditing ? "Editar Profissional" : "Cadastrar Profissional"}
                        </h2>
                        <button onClick={onClose}>
                                    <FaTimes className="text-gray-500 hover:text-red-500" />
                        </button>
                    </div>
                    <div>
                        <InputPrimary
                            label="Nome"
                            placeholder="Nome do profissional"
                            value={formData.nome.value}
                            onChange={handleFieldChange('nome')}
                            disabled={isDisabled}
                            errorMessage={emptyFields.nome ? "Este campo é obrigatório" : ""}
                        />

                        <InputPrimary
                            label="Cargo"
                            placeholder="Escreva o cargo"
                            value={formData.cargo.value}
                            onChange={handleFieldChange('cargo')}
                            disabled={isDisabled}
                            errorMessage={emptyFields.cargo ? "Este campo é obrigatório" : ""}
                        />
                        <RadioInput
                            title="Situação"
                            options={options}
                            selectedValue={formData.status.value}
                            disabled={isDisabled}
                            onChange={handleFieldChange('status')}
                        />
                    </div>
                    <div className="flex justify-center mt-8">
                        <ButtonSecondary onClick={onClose}>Cancelar</ButtonSecondary>
                        <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                    </div>

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

        </>
    )
}

export default TeamModal;