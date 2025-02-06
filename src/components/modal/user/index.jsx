import { useState } from "react";
import InputSecondary from "../../inputs/inputSecondary";
import InputSelect from "../../inputs/inputSelect";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";

const UserModal = ({ user, onClose, onSave, emptyFields, setEmptyFields }) => {
    const [formData, setFormData] = useState({
        id: user?.id || null,
        name: user?.name || "",
        email: user?.email || "",
        password: user?.password || "",
        role: user?.role || "",
    });

    const validateFields = () => {
        const newEmptyFields = {};
        Object.keys(formData).forEach((field) => {
            if (!formData[field] && (field === "name" || field === "password" || field === "role")) {
                newEmptyFields[field] = true;
            }
        });
        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSubmit = () => {
        if (!validateFields()) return;
        onSave(formData);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setEmptyFields((prev) => {
            const updated = { ...prev };
            if (value.trim()) delete updated[field];
            return updated;
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-sm md:text-base text-primary-dark font-bold mb-4">{user ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
                <div className="flex flex-col space-y-4">
                    <InputSecondary
                        label="Nome"
                        placeholder="Nome do usuário"
                        type="text"
                        value={formData.name}
                        onChange={(value) => handleChange("name", value)}
                        errorMessage={emptyFields.name ? "Campo obrigatório" : ""}
                    />
                    <InputSecondary
                        label="Email"
                        placeholder="Email do usuário"
                        type="text"
                        value={formData.email}
                        onChange={(value) => handleChange("email", value)}
                    />
                    <InputSecondary
                        label="Senha"
                        placeholder="Defina a senha"
                        type="password"
                        value={formData.password}
                        onChange={(value) => handleChange("password", value)}
                        errorMessage={emptyFields.password ? "Campo obrigatório" : ""}
                    />
                    <InputSelect
                        label="Papel"
                        options={[
                            { label: "Administrador", value: "adm" },
                            { label: "Colaborador I", value: "colabI" },
                            { label: "Colaborador II", value: "colabII" },
                        ]}
                        value={formData.role}
                        onChange={(value) => handleChange("role", value)}
                        errorMessage={emptyFields.role ? "Campo obrigatório" : ""}
                    />
                </div>
                <div className="flex justify-center mt-8 gap-y-2 md:gap-x-2">
                    <ButtonSecondary onClick={onClose}>Cancelar</ButtonSecondary>
                    <ButtonPrimary onClick={handleSubmit}>Salvar</ButtonPrimary>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
