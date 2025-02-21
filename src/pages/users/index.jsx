import PageTitle from "../../components/title";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import ConfirmationModal from "../../components/modal/confirmation";
import UserModal from "../../components/modal/user";
import MessageBox from "../../components/box/message";
import SearchInput from '../../components/inputs/searchInput';


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
            <div className="flex flex-col w-full">
                <PageTitle
                    text="Usuários do sistema"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />
                <div className="flex items-center w-full gap-x-2 px-2 md:px-6 pt-3 mb-3">
                    <SearchInput
                        placeholder="Buscar..."
                        

                    />

                    <button
                        onClick={() => {
                            setUserToEdit(null);
                            setShowModal(true);
                        }}
                        className="flex items-center bg-primary-light text-sm text-white px-3.5 md:px-4 h-10 rounded-lg hover:bg-green-700 gap-2"
                    >

                        <FaPlus className="h-3 w-3"/> 
                        <span className="text-sm">Adicionar Usuário</span>
                    </button>
                </div>

                <div className="flex flex-col py-4 rounded-md bg-white px-2 md:px-6">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm md:text-base font-medium text-gray-800 mt-3 mb-6">Lista de usuários</p>
                        <p className="flex text-sm text-gray-400mb-2">Total de usuários: {users.length}</p>
                    </div>
                    <div className="flex text-sm font-medium text-gray-700 md:justify-none justify-between  px-2 border-b border-gray-300 py-2">
                        <p className="flex flex-col md:w-1/2">Nome</p>
                        <p className="flex flex-col md:w-1/2">Email</p>
                        <p className="flex flex-col md:w-1/3">Papel</p>
                        <p>Ações</p>
                    </div>
                    <div className="flex flex-col">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col md:flex-row px-2 py-2  text-primary-dark text-sm bg-white border-b border-gray-300 hover:bg-gray-50 uppercase"
                            >
                                <div className="flex flex-col md:w-1/2">
                                    <span>{user.name}</span>
                                </div>
                                <div className="flex flex-col md:w-1/2">
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex flex-col md:w-1/3">
                                    <span>{user.role}</span>
                                </div>
                                <div className="flex items-center space-x-2 justify-end">
                                    <button onClick={() => handleAction(user, 'edit')} className="text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-blue-100  hover:text-blue-500">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleAction(user, 'delete')} className="text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-blue-100  hover:text-blue-500">
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
