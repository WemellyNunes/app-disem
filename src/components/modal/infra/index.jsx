import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import InputPrimary from "../../inputs/inputPrimary";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import MessageBox from "../../box/message";
import RadioInput from "../../inputs/radioInput";
import InputSelect from "../../inputs/inputSelect";

import { createInstitute, updateInstitute, createUnit, getAllUnits } from "../../../utils/api/api";


const InfraModal = ({ onClose, data = null, isEditing = false }) => {
    const [selectedType, setSelectedType] = useState("instituto"); // Define se é Instituto ou Unidade
    const [formDataInstituto, setFormDataInstituto] = useState({
        nome: { value: "", required: true },
        sigla: { value: "", required: true },
        unidade: { value: "", required: true },
        campus: { value: "", required: true },
    });
    const [formDataUnidade, setFormDataUnidade] = useState({
        unidade: { value: "", required: true },
        campus: { value: "", required: true },
    });
    const [units, setUnits] = useState([]);
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        fetchUnits();

        if (data && isEditing) {
            if (data.type === "instituto") {
                setSelectedType("instituto");
                setFormDataInstituto({
                    nome: { value: data.name || "", required: true },
                    sigla: { value: data.acronym || "", required: true },
                    unidade: { value: data.unit || "", required: true },
                    campus: { value: data.campus || "", required: true },
                });
            } else if (data.type === "unidade") {
                setSelectedType("unidade");
                setFormDataUnidade({
                    unidade: { value: data.unit || "", required: true },
                    campus: { value: data.campus || "", required: true },
                });
            }
        }
    }, [data, isEditing]);

    const fetchUnits = async () => {
        try {
            const response = await getAllUnits(); // Supondo que o endpoint retorna as unidades
            const formattedUnits = response.map((unit) => ({
                label: unit.unit.toUpperCase(), // O que será exibido no `select`
                value: unit.unit, 
                campus: unit.campus.toUpperCase(),
            }));
            setUnits(formattedUnits);
        } catch (error) {
            console.error("Erro ao carregar as unidades:", error);
        }
    };

    const handleFieldChange = (field, type) => (value) => {
        if (type === "instituto") {
            setFormDataInstituto((prevData) => ({
                ...prevData,
                [field]: { ...prevData[field], value },
            }));
        } else if (type === "unidade") {
            setFormDataUnidade((prevData) => ({
                ...prevData,
                [field]: { ...prevData[field], value },
            }));
        }
    };

    useEffect(() => {
        if (selectedType === "instituto") {
            const selectedUnit = units.find(
                (unit) => unit.value === formDataInstituto.unidade.value
            );
            if (selectedUnit) {
                setFormDataInstituto((prevData) => ({
                    ...prevData,
                    campus: { ...prevData.campus, value: selectedUnit.campus },
                }));
            }
        }
    }, [formDataInstituto.unidade.value, selectedType, units]);

    const validateFields = () => {
        const newEmptyFields = {};
        const formData = selectedType === "instituto" ? formDataInstituto : formDataUnidade;

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
                message: "Preencha todos os campos obrigatórios.",
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 2000);
            return;
        }

        setIsDisabled(true);

        try {
            if (selectedType === "instituto") {
                const institutePayload = {
                    name: formDataInstituto.nome.value,
                    acronym: formDataInstituto.sigla.value,
                    unit: formDataInstituto.unidade.value,
                    campus: formDataInstituto.campus.value,
                };

                if (isEditing) {
                    await updateInstitute(data.id, institutePayload);
                } else {
                    await createInstitute(institutePayload);
                }
            } else if (selectedType === "unidade") {
                const unitPayload = {
                    unit: formDataUnidade.unidade.value,
                    campus: formDataUnidade.campus.value,
                };

                await createUnit(unitPayload);
            }

            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: `${selectedType === "instituto" ? "Instituto" : "Unidade"} salvo com sucesso!`,
            });
            setShowMessageBox(true);

            setTimeout(() => {
                setShowMessageBox(false);
                onClose(); // Fecha o modal
            }, 2000);
        } catch (error) {
            setMessageContent({
                type: "error",
                title: "Erro.",
                message: `Não foi possível salvar o ${selectedType}.`,
            });
            setShowMessageBox(true);
            setIsDisabled(false);
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-primary-light">
                        {isEditing
                            ? `Editar ${selectedType === "instituto" ? "Instituto" : "Unidade"}`
                            : `Cadastrar ${selectedType === "instituto" ? "Instituto" : "Unidade"}`}
                    </h2>
                    <button onClick={onClose}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                </div>

                <RadioInput
                    title="Tipo de Cadastro"
                    options={[
                        { label: "Instituto", value: "instituto" },
                        { label: "Unidade", value: "unidade" },
                    ]}
                    name="tipoCadastro"
                    selectedValue={selectedType}
                    onChange={(value) => setSelectedType(value)}
                />

                <div className="mt-4">
                    {selectedType === "instituto" && (
                        <>
                            <InputPrimary
                                label="Nome"
                                placeholder="Nome do instituto"
                                value={formDataInstituto.nome.value}
                                onChange={handleFieldChange("nome", "instituto")}
                                disabled={isDisabled}
                                errorMessage={emptyFields.nome ? "Este campo é obrigatório" : ""}
                            />
                            <InputPrimary
                                label="Sigla"
                                placeholder="Sigla do instituto"
                                value={formDataInstituto.sigla.value}
                                onChange={handleFieldChange("sigla", "instituto")}
                                disabled={isDisabled}
                                errorMessage={emptyFields.sigla ? "Este campo é obrigatório" : ""}
                            />
                            <InputSelect
                                label="Unidade"
                                options={units}
                                onChange={(value) => handleFieldChange("unidade", "instituto")(value)}
                                value={formDataInstituto.unidade.value}
                                disabled={isDisabled}
                                errorMessage={emptyFields.unidade ? "Este campo é obrigatório" : ""}
                            />
                            <InputPrimary
                                label="Campus"
                                placeholder="Campus"
                                value={formDataInstituto.campus.value}
                                onChange={handleFieldChange("campus", "instituto")}
                                disabled
                                errorMessage=""
                            />
                        </>
                    )}
                    {selectedType === "unidade" && (
                        <>
                            <InputPrimary
                                label="Unidade"
                                placeholder="Unidade"
                                value={formDataUnidade.unidade.value}
                                onChange={handleFieldChange("unidade", "unidade")}
                                disabled={isDisabled}
                                errorMessage={emptyFields.unidade ? "Este campo é obrigatório" : ""}
                            />
                            <InputPrimary
                                label="Campus"
                                placeholder="Campus"
                                value={formDataUnidade.campus.value}
                                onChange={handleFieldChange("campus", "unidade")}
                                disabled={isDisabled}
                                errorMessage={emptyFields.campus ? "Este campo é obrigatório" : ""}
                            />
                        </>
                    )}
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

export default InfraModal;
