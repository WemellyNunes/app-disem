import PageTitle from "../../components/title";
import { FaUsers, FaArrowRight, FaEye } from "react-icons/fa";
import InputSecondary from "../../components/inputs/inputSecondary";
import InputSelect from "../../components/inputs/inputSelect";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import ButtonSecondary from "../../components/buttons/buttonSecondary";
import MessageBox from "../../components/box/message";
import { IoMdMail } from "react-icons/io";
import { useState } from "react";

export default function UserPage() {
    const [users, setUsers] = useState([
        { id: 1, name: 'Fulano Silva', email: 'fulano@gmail.com', role: 'ADM', active: true },
        { id: 2, name: 'Ciclano Pereira', email: 'ciclano@gmail.com', role: 'COLAB.', active: false },
    ]); 
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });

    const options = [
        { label: 'Administrador', value: 'adm' },
        { label: 'Colaborador I', value: 'colabI' },
        { label: 'Colaborador II', value: 'colabII' },
    ];

    const handleSave = () => {
        setUsers([...users, { ...newUser, id: users.length + 1, active: true }]); 
        setNewUser({ name: '', email: '', password: '', role: '' }); 
    };

    return (
        <>
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
                    
                    <div className="flex flex-col p-8 w-full h-full md:w-1/3 gap-y-4 rounded-md bg-white shadow">
                        <p className="text-lg font-normal text-primary-light mb-2">Cadastrar novo usuário</p>
                        <InputSecondary
                            label="Usuário"
                            placeholder="Nome do usuário"
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            buttonIcon={<FaArrowRight />}
                        />
                        <InputSecondary
                            label="Email"
                            placeholder="Email do usuário"
                            type="text"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            buttonIcon={<IoMdMail />}
                        />
                        <InputSecondary
                            label="Senha"
                            placeholder="Defina a senha"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            buttonIcon={<FaEye />}
                        />
                        <InputSelect
                            label="Papel*"
                            options={options}
                            onChange={(value) => setNewUser({ ...newUser, role: value })}
                        />
                        <div className="flex w-full mt-4 justify-end">
                            <ButtonPrimary onClick={handleSave}>Salvar</ButtonPrimary>
                            <ButtonSecondary>Cancelar</ButtonSecondary>
                        </div>
                    </div>

                    {/* Seção de Lista de Usuários */}
                    <div className="flex flex-col w-full p-4 rounded-md bg-white shadow">
                        <div className="flex mb-4 border-b border-primary-light">
                            <p className="text-lg font-normal text-primary-light py-2">Lista de usuários</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className={`flex flex-col md:flex-row px-4 py-2 rounded shadow-sm text-primary-dark text-sm ${user.active ? 'bg-green-50' : 'bg-red-50'} hover:border hover:border-primary-light`}
                                >
                                    <div className="flex flex-col md:w-1/2 space-y-1">
                                        <span>{user.name}</span>
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex flex-col md:w-1/3 space-y-1">
                                        <span>{user.role}</span>
                                    </div>
                                    <div className="flex flex-col md:w-1/3 items-end space-y-1">
                                        <span className={`font-medium ${user.active ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600">Editar</button>
                                            <button className="text-red-600">Excluir</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
