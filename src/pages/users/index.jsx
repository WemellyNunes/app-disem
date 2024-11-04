import PageTitle from "../../components/title";
import { FaUsers, FaArrowRight, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import InputSecondary from "../../components/inputs/inputSecondary";
import InputSelect from "../../components/inputs/inputSelect";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import MessageBox from "../../components/box/message";
import { IoMdMail } from "react-icons/io";
import { useState } from "react";
import ConfirmationModal from "../../components/modal/confirmation";

export default function UserPage() {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [actionType, setActionType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
    const [password, setPassword] = useState("");

    const options = [
        { label: 'Administrador', value: 'adm' },
        { label: 'Colaborador I', value: 'colabI' },
        { label: 'Colaborador II', value: 'colabII' },
    ];

    const handleFieldChange = (field) => (value) => {
        setNewUser((prevData) => ({ ...prevData, [field]: value }));
    };

    const validateFields = () => {
        const newEmptyFields = {};
        const requiredFields = ['name', 'email', 'password', 'role'];

        requiredFields.forEach((field) => {
            const value = newUser[field];
            if (!value.trim()) {
                newEmptyFields[field] = true;
            }
        });

        setEmptyFields(newEmptyFields);
        return Object.keys(newEmptyFields).length === 0;
    };

    const handleSave = () => {
        if (!validateFields()) {
            setMessageContent({ type: 'error', title: 'Erro.', message: 'Por favor, preencha todos os campos obrigatórios.' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
            return;
        }

        if (isEditing) {
            // Atualiza o usuário existente
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userToEdit.id ? { ...userToEdit, ...newUser } : user
                )
            );
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário atualizado com sucesso!' });
            setIsEditing(false);
            setUserToEdit(null);
        } else {
            // Adiciona um novo usuário
            setUsers([...users, { ...newUser, id: users.length + 1, active: true }]);
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário cadastrado com sucesso!' });
        }

        setNewUser({ name: '', email: '', password: '', role: '' }); // Limpa os campos após o salvamento
        setShowMessageBox(true);
        setTimeout(() => setShowMessageBox(false), 1500);
    };

    const handleAction = (user, action) => {
        setUserToEdit(user);
        setActionType(action);
        setShowConfirmation(true);
    };

    const handleConfirmAction = () => {
        if (actionType === 'edit') {
            setIsEditing(true);
            setNewUser(userToEdit); // Preenche os campos com os dados do usuário
            setShowConfirmation(false);
        } else if (actionType === 'delete') {
            setUsers(users.filter((user) => user.id !== userToEdit.id)); // Remove o usuário
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário excluído com sucesso!' });
            setShowMessageBox(true);
            setShowConfirmation(false);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
    };

    return (
        <>
            {showMessageBox && (
                <MessageBox
                    type={messageContent.type}
                    title={messageContent.title}
                    message={messageContent.message}
                    onClose={() => setShowMessageBox(false)}
                />
            )}
            <div className="flex flex-col">
                <div>
                    <PageTitle
                        icon={FaUsers}
                        text="Usuários do sistema"
                        backgroundColor="bg-white"
                        textColor="text-primary-light"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                    <div className="flex flex-col p-6 md:p-8 w-full h-full md:w-1/3 gap-y-4 rounded-md bg-white shadow">
                        <p className="text-base md:text-lg font-normal text-primary-light mb-2">{isEditing ? "Editar Usuário" : "Cadastrar novo usuário"}</p>

                        <InputSecondary
                            label="Usuário *"
                            placeholder="Nome do usuário"
                            type="text"
                            value={newUser.name}
                            onChange={handleFieldChange('name')}
                            buttonIcon={<FaArrowRight />}
                            errorMessage={emptyFields.name ? "Este campo é obrigatório" : ""}
                            className={emptyFields.name ? 'border-red-600' : ''}
                        />
                        <InputSecondary
                            label="Email *"
                            placeholder="Email do usuário"
                            type="text"
                            value={newUser.email}
                            onChange={handleFieldChange('email')}
                            buttonIcon={<IoMdMail />}
                            errorMessage={emptyFields.email ? "Este campo é obrigatório" : ""}
                            className={emptyFields.email ? 'border-red-600' : ''}
                        />

                        <InputSecondary
                            label="Senha *"
                            placeholder="Defina a senha"
                            type="password"
                            value={newUser.password}
                            onChange={handleFieldChange('password')}
                            errorMessage={emptyFields.password ? "Este campo é obrigatório" : ""}
                            className={emptyFields.password ? 'border-red-600' : ''}
                        />

                        <InputSelect
                            label="Papel *"
                            options={options}
                            onChange={handleFieldChange('role')}
                            value={newUser.role}
                            className={emptyFields.role ? 'border-red-600' : ''}
                        />

                        <div className="flex flex-col md:flex-row w-full mt-4 justify-end gap-y-2 md:gap-y-0">
                            <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                            <ButtonSecondary>Cancelar</ButtonSecondary>
                        </div>
                    </div>

                    <div className="flex flex-col w-full py-4 px-6 rounded-md bg-white shadow ">
                        <div className="flex mb-2 border-b border-primary-light">
                            <p className="text-lg font-normal text-primary-light py-2">Lista de usuários</p>
                        </div>

                        <p className="flex justify-end text-xs text-primary-dark mb-2">Usuários: {users.length}</p>

                        <div className="flex flex-col space-y-2">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col md:flex-row px-4 py-2 rounded shadow-sm text-primary-dark text-sm bg-white border border-gray-200 hover:border hover:border-primary-light"
                                >
                                    <div className="flex flex-col md:w-1/2 space-y-1">
                                        <span>{user.name}</span>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex flex-col justify-center md:w-1/3 space-y-1">
                                        <span>{user.role}</span>
                                    </div>
                                    <div className="flex flex-col md:w-1/3 items-end justify-center">
                                        <div className="flex space-x-2">
                                            <button className="text-primary-light" onClick={() => handleAction(user, 'edit')}>
                                                <FaEdit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600" onClick={() => handleAction(user, 'delete')}>
                                                <FaTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <ConfirmationModal
                    title={actionType === 'delete' ? "Confirmar Exclusão" : "Confirmar Edição"}
                    message={`Tem certeza que deseja ${actionType === 'delete' ? "excluir" : "editar"} as informações de ${userToEdit?.name}?`}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
}
