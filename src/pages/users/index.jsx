import PageTitle from "../../components/title";
import { FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import ConfirmationModal from "../../components/modal/confirmation";
import UserModal from "../../components/modal/user";
import MessageBox from "../../components/box/message";

export default function UserPage() {
    const [emptyFields, setEmptyFields] = useState({});
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: '', title: '', message: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [actionType, setActionType] = useState('');
    const [users, setUsers] = useState([]);

    const handleSaveUser = (user) => {
        if (user.id) {
            // Edit user
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
            );
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário atualizado com sucesso!' });
        } else {
            // Add new user
            setUsers((prevUsers) => [...prevUsers, { ...user, id: prevUsers.length + 1 }]);
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário cadastrado com sucesso!' });
        }
        setShowMessageBox(true);
        setTimeout(() => setShowMessageBox(false), 1500);
        setShowModal(false);
    };

    const handleAction = (user, action) => {
        setUserToEdit(user);
        setActionType(action);
        setShowConfirmation(true);
    };

    const handleConfirmAction = () => {
        if (actionType === 'delete') {
            setUsers(users.filter((user) => user.id !== userToEdit.id));
            setMessageContent({ type: 'success', title: 'Sucesso.', message: 'Usuário excluído com sucesso!' });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1500);
        }
        setShowConfirmation(false);
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
                <PageTitle
                    icon={FaUsers}
                    text="Usuários do sistema"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />
                <div className="flex justify-start px-6 mt-4">
                    <button
                        onClick={() => {
                            setUserToEdit(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-1 text-base bg-primary-light text-white rounded-md shadow-sm"
                    >
                        <FaPlus /> Adicionar Usuário
                    </button>
                </div>
                <div className="flex flex-col py-4 px-6 mx-6 rounded-md bg-white border border-gray-300 shadow-sm mt-4">
                    <div className="flex mb-2 border-b border-gray-300">
                        <p className="text-sm font-normal text-primary-dark py-2">Lista de usuários</p>
                    </div>
                    <p className="flex justify-end text-xs text-primary-dark mb-2">Usuários: {users.length}</p>
                    <div className="flex flex-col space-y-2">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col md:flex-row px-4 py-2 rounded shadow-sm text-primary-dark text-sm bg-white border border-gray-200 hover:border-primary-light"
                            >
                                <div className="flex flex-col md:w-1/2">
                                    <span>{user.name}</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex flex-col md:w-1/3">
                                    <span>{user.role}</span>
                                </div>
                                <div className="flex items-center space-x-2 md:w-1/6 justify-end">
                                    <button onClick={() => handleAction(user, 'edit')} className="text-primary-light">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleAction(user, 'delete')} className="text-red-600">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <UserModal
                    user={userToEdit}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveUser}
                    emptyFields={emptyFields}
                    setEmptyFields={setEmptyFields}
                />
            )}

            {showConfirmation && (
                <ConfirmationModal
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir as informações de ${userToEdit?.name}?`}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
}
