import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageTitle from "../../components/title";
import SearchInput from "../../components/inputs/searchInput";
import { listarUsuarios } from "../../utils/api/webservice";
import MessageBox from "../../components/box/message";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(false);

            try {
                const userData = await listarUsuarios();
                setUsers(userData);
                setFilteredUsers(userData);
            } catch (err) {
                console.error("Erro ao carregar usuários:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);

        if (query === "") {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(user =>
                    user.nome.toLowerCase().includes(query) || 
                    user.email.toLowerCase().includes(query)
                )
            );
        }
    };

    return (
        <>
            {error && (
                <MessageBox
                    type="error"
                    title="Erro ao carregar usuários."
                    message="Não foi possível carregar os usuários no momento."
                    onClose={() => setError(false)}
                />
            )}

            <PageTitle text="Usuários do sistema" backgroundColor="bg-white" textColor="text-primary-dark" />

            <div className="flex items-center w-full gap-x-2 px-2 md:px-6 pt-3 mb-3">
                <SearchInput placeholder="Buscar usuário..." value={search} onSearch={handleSearch} />
                <button className="flex items-center bg-primary-light text-white px-4 h-10 rounded-lg hover:bg-green-700">
                    <FaPlus className="h-3 w-3" /> <span className="text-sm">Adicionar Usuário</span>
                </button>
            </div>

            <div className="flex flex-col py-4 rounded-md bg-white px-2 md:px-6">
                <p className="text-sm font-medium text-gray-800 mt-3 mb-6">Lista de usuários</p>
                <p className="text-sm text-gray-400">Total: {filteredUsers.length}</p>

                <div className="flex text-sm px-2 font-medium text-gray-700 border-b  border-gray-300 py-2">
                    <p className="flex flex-col md:w-1/2">Nome</p>
                    <p className="flex flex-col md:w-1/2">Email</p>
                    <p className="flex flex-col md:w-1/3">Papel</p>
                    <p className="flex md:mr-8">Ações</p>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-4">Carregando usuários...</p>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="flex flex-col md:items-center md:flex-row px-2 py-2 text-primary-dark text-sm border-b hover:bg-gray-50">
                            <div className="md:w-1/2 ">{user.nome}</div>
                            <div className="md:w-1/2">{user.email}</div>
                            <div className="md:w-1/3">{user.papel}</div>
                            <div className="flex space-x-2 justify-end">
                                <button className="text-gray-700 bg-gray-100 p-2 rounded-full hover:text-blue-500">
                                    <FaEdit />
                                </button>
                                <button className="text-gray-700 bg-gray-100 p-2 rounded-full hover:text-red-500">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">Nenhum usuário encontrado</p>
                )}
            </div>
        </>
    );
}
