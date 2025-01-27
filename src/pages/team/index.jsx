import { useState, useEffect } from 'react';
import PageTitle from '../../components/title';
import TeamModal from '../../components/modal/team';
import { FaPlus, FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import SearchInput from '../../components/inputs/searchInput';
import ConfirmationModal from '../../components/modal/confirmation';
import MessageBox from '../../components/box/message';

import { getAllTeams, deleteTeam, uploadTeams  } from '../../utils/api/api';
import { parseExcelFile } from '../../utils/parseExcel';


export default function TeamPage() {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showMessageBox, setShowMessageBox] = useState(false);

    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [teams, setTeams] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);

    const statusClasses = {
        'ATIVO': 'font-medium text-primary-light text-xs',
        'FÉRIAS': 'font-medium text-orange-700  text-xs',
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        fetchTeams();
    };

    const handleEditClick = (team) => {
        setSelectedTeam(team); // Define o profissional selecionado
        setShowModal(true);    // Abre o modal
    };


    const fetchTeams = async () => {
        try {
            const data = await getAllTeams();

            const sortedTeams = data.sort((a, b) => a.id - b.id);

            setTeams(sortedTeams);
            setFilteredData(sortedTeams);
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);


    const filterData = (term) => {
        if (!term) {
            setFilteredData(teams); // Se o termo estiver vazio, exibe todos os dados
        } else {
            const filtered = teams.filter((team) =>
                team.name.toLowerCase().includes(term.toLowerCase()) ||
                team.role.toLowerCase().includes(term.toLowerCase()) ||
                team.status.toLowerCase().includes(term.toLowerCase())

            );
            setFilteredData(filtered); // Atualiza a lista filtrada
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterData(term); // Aplica o filtro
    };

    const handleDeleteClick = (team) => {
        setSelectedTeam(team); // Define o profissional selecionado
        setShowConfirmationModal(true); // Abre o modal
    };

    
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        try {
            // Converte o arquivo para JSON
            const formattedData = await parseExcelFile(file);
            console.log('Dados convertidos:', formattedData);
    
            // Envia para o backend como ARRAY
            await uploadTeams(formattedData);
    
            // Exibe mensagem de sucesso
            setMessageContent({
                type: "success",
                title: "Sucesso.",
                message: "Profissionais cadastrados com sucesso!"
            });
            setShowMessageBox(true);
    
            setTimeout(() => {
                setShowMessageBox(false); // Esconde o MessageBox após 1.5s
                window.location.reload(); // Atualiza a página
            }, 1000);
    
        } catch (error) {
            console.error('Erro ao enviar planilha:', error);
    
            // Exibe mensagem de erro
            setMessageContent({
                type: "error",
                title: "Erro.",
                message: "Erro ao enviar planilha. Verifique o formato ou os campos."
            });
            setShowMessageBox(true);
    
            setTimeout(() => {
                setShowMessageBox(false); // Esconde o MessageBox após 1.5s
            }, 1500);
        }
    };
    
    


    const handleConfirmDelete = async () => {
        if (selectedTeam) {
            try {
                await deleteTeam(selectedTeam.id); // Chama o endpoint
                setMessageContent({
                    type: "success",
                    title: "Sucesso.",
                    message: "Profissional deletado com sucesso!"
                });
                setShowMessageBox(true); 
                fetchTeams();
                setTimeout(() => setShowMessageBox(false), 1000); 
            } catch (error) {
                setMessageContent({
                    type: "error",
                    title: "Erro.",
                    message: "Erro ao deletar profissional."
                });
                setShowMessageBox(true);
                setTimeout(() => setShowMessageBox(false), 1500); 
            } finally {
                setShowConfirmationModal(false); 
            }
        }
    };


    return (
        <>
            <div className='flex flex-col'>
                <PageTitle
                    text="Equipe"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />

                <div className="pt-3 px-2 md:px-6">
                    <div className='flex flex-row gap-x-2 mb-3 '>
                        <SearchInput
                            placeholder="Buscar..."
                            onSearch={handleSearch}

                        />
                        <button
                            className='flex items-center bg-primary-light text-sm text-white px-3.5 md:px-4 h-9 rounded-lg hover:bg-blue-700 gap-2'
                            onClick={handleOpenModal}
                        >
                            <span><FaPlus className='h-3 w-3' /></span>
                            <span className='hidden md:flex flex-wrap' >Cadastrar</span>
                        </button>
                        <div className='flex gap-x-2 items-center'>
                            <label className='flex items-center border border-primary-light text-primary-light text-sm bg-white px-3.5 md:px-4 h-9 rounded-lg hover:bg-blue-100 gap-2 cursor-pointer'>
                                <span><FaUpload className='h-3 w-3' /></span>
                                <span className='hidden md:flex'>Enviar planilha</span>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    style={{display: 'none'}}
                                    id='fileUpload'
                                />
                            </label>
                            <span className='flex text-xs md:text-sm text-gray-500 flex-wrap'>Envie uma planilha com novos profissionais</span>
                        </div>
                    </div>

                    <div className="flex flex-col py-4 rounded-md bg-white">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm md:text-base font-medium text-gray-800 mt-3 mb-6">Lista de profissionais</p>
                            <p className="flex text-sm text-gray-500 mb-2">Total de profissionais: {filteredData.length}</p>
                        </div>
                        <div className="flex text-sm font-medium text-gray-700 md:justify-none justify-between px-2 border-b border-gray-300 py-2">
                            <p className='flex flex-col md:w-1/12'>ID</p>
                            <p className="flex flex-col md:w-1/2" >Nome</p>
                            <p className="flex flex-col md:w-1/2">Cargo</p>
                            <p className='flex flex-col md:w-1/3'>Status</p>
                            <p className='flex md:mr-7'>Ações</p>
                        </div>

                        <div className="flex flex-col ">
                            {filteredData.length > 0 ? (
                                filteredData.map((team) => (
                                    <div
                                        key={team.id}
                                        className="flex flex-col md:items-center md:flex-row px-2 py-2  text-primary-dark text-sm bg-white border-b border-gray-300 hover:bg-gray-50 uppercase"
                                    >
                                        <div className="flex flex-col md:w-1/12">
                                            <span>{team.id}</span>
                                        </div>
                                        <div className="flex flex-col md:w-1/2">
                                            <span>{team.name}</span>
                                        </div>
                                        <div className="flex flex-col md:w-1/2">
                                            <span>{team.role}</span>
                                        </div>
                                        <div className={`${statusClasses[team.status]} flex flex-col md:w-1/3`}>
                                            <span>{team.status}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 justify-end">
                                            <button
                                                onClick={() => handleEditClick(team)}
                                                className="text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-blue-100  hover:text-blue-500"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(team)}
                                                className="text-gray-700 bg-gray-100 p-2 rounded-full hover:bg-blue-100  hover:text-blue-500"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-gray-500 py-4">
                                    Nenhum registro encontrado.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showModal && <TeamModal onClose={handleCloseModal}
                    teamData={selectedTeam} />}

                {showConfirmationModal && (
                    <ConfirmationModal
                        title="Excluir Profissional"
                        message="Tem certeza que deseja excluir este profissional?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowConfirmationModal(false)}
                    />
                )}
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
    );
}
