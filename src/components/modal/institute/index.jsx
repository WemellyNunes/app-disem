import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa';
import InputPrimary from '../../inputs/inputPrimary'
import ButtonPrimary from '../../buttons/buttonPrimary'
import ButtonSecondary from '../../buttons/buttonSecondary'
import MessageBox from "../../box/message"

import { createInstitute, updateInstitute } from '../../../utils/api/api';

const InstituteModal = ({ onClose, instituteData = null }) => {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [isDisabled, setIsDisabled] = useState(false);

    const [formData, setFormData] = useState({
        nome: { value: '', required: true },
        sigla: { value: '', required: true },
        unidade: { value: '', required: true },
        campus: { value: '', required: true }
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (instituteData) {
            setIsEditing(true);
            setFormData({
                nome: { value: instituteData.name, required: true },
                sigla: { value: instituteData.acronym, required: true },
                unidade: { value: instituteData.unit, required: true },
                campus: { value: instituteData.campus, required: true },
            });
        }
    }, [instituteData]);

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

        setIsDisabled(true);

        const institutePayload = {
            name: formData.nome.value,
            acronym: formData.sigla.value,
            unit: formData.unidade.value,
            campus: formData.campus.value,
            created_at: new Date().toISOString().split("T")[0]
        };

        try {
            if (isEditing) {
                await updateInstitute(instituteData.id, institutePayload);
                setMessageContent({
                    type: "success",
                    title: "Sucesso.",
                    message: "Instituto atualizado com sucesso!"
                });
            } else {
                await createInstitute(institutePayload);
                setMessageContent({
                    type: "success",
                    title: "Sucesso.",
                    message: "Instituto cadastrado com sucesso!"
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
                message: "Não foi possível salvar o instituto."
            });
            setShowMessageBox(true);
            setIsDisabled(false);
            console.error("Erro:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className='bg-white p-6 rounded-md shadow-md w-96'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='font-medium text-primary-light'>
                        {isEditing ? "Editar Instituto" : "Cadastrar Instituto"}
                    </h2>
                    <button onClick={onClose}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                </div>
                <div>
                    <InputPrimary
                        label="Nome"
                        placeholder="Nome do instituto"
                        value={formData.nome.value}
                        onChange={handleFieldChange('nome')}
                        disabled={isDisabled}
                        errorMessage={emptyFields.nome ? "Este campo é obrigatório" : ""}
                    />
                    <InputPrimary
                        label="Sigla"
                        placeholder="Escreva a sigla"
                        value={formData.sigla.value}
                        onChange={handleFieldChange('sigla')}
                        disabled={isDisabled}
                        errorMessage={emptyFields.sigla ? "Este campo é obrigatório" : ""}
                    />
                    <InputPrimary
                        label="Unidade"
                        placeholder="Escreva a unidade"
                        value={formData.unidade.value}
                        onChange={handleFieldChange('unidade')}
                        disabled={isDisabled}
                        errorMessage={emptyFields.unidade ? "Este campo é obrigatório" : ""}
                    />
                    <InputPrimary
                        label="Campus"
                        placeholder="Escreva o campus"
                        value={formData.campus.value}
                        onChange={handleFieldChange('campus')}
                        disabled={isDisabled}
                        errorMessage={emptyFields.campus ? "Este campo é obrigatório" : ""}
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
    );
};

export default InstituteModal;
