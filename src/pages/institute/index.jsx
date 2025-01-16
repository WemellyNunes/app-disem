import { useState, useEffect } from 'react';
import PageTitle from '../../components/title';
import SearchInput from '../../components/inputs/searchInput';
import ConfirmationModal from '../../components/modal/confirmation';
import MessageBox from '../../components/box/message';
import InstituteModal from '../../components/modal/institute';

import { FaPlus, FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import { getAllInstitutes, deleteInstitute } from '../../utils/api/api';

export default function InstitutePage() {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [institutes, setInstitutes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const [filteredData, setFilteredData] = useState([]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInstitute(null); // Limpa o item selecionado
        fetchInstitutes();
    };
    

    const handleEditClick = (institute) => {
        setSelectedInstitute(institute); // Define o profissional selecionado
        setShowModal(true);    // Abre o modal
    };

    const fetchInstitutes = async () => {
        try {
            const data = await getAllInstitutes();

            const sortedInstitutes = data.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );

            setInstitutes(sortedInstitutes);
            setFilteredData(sortedInstitutes);
        } catch (error) {
            console.error("Erro ao buscar os institutos:", error);
        }
    };

    useEffect(() => {
        fetchInstitutes();
    }, []);

    const filterData = (term) => {
        if (!term) {
            setFilteredData(institutes); 

        } else {
            const filtered = institutes.filter((item) =>
                item.name.toLowerCase().includes(term.toLowerCase()) ||
                item.acronym.toLowerCase().includes(term.toLowerCase()) ||
                item.unit.toLowerCase().includes(term.toLowerCase()) ||
                item.campus.toLowerCase().includes(term.toLowerCase())

            );
            setFilteredData(filtered); // Atualiza a lista filtrada
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterData(term); // Aplica o filtro
    };

    const handleDeleteClick = (institute) => {
        setSelectedInstitute(institute); // Define o profissional selecionado
        setShowConfirmationModal(true); // Abre o modal
    };

    const handleConfirmDelete = async () => {
            if (selectedInstitute) {
                try {
                    await deleteInstitute(selectedInstitute.id); // Chama o endpoint
                    setMessageContent({
                        type: "success",
                        title: "Sucesso.",
                        message: "Instituto deletado com sucesso!"
                    });
                    setShowMessageBox(true); 
                    fetchInstitutes();
                    setTimeout(() => setShowMessageBox(false), 1000); 
                } catch (error) {
                    setMessageContent({
                        type: "error",
                        title: "Erro.",
                        message: "Erro ao deletar o instituto."
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
                    text="Institutos e unidades"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />

                <div className='pt-3 px-2 md:px-6'>
                    <div className='flex flex-row gap-x-2 mb-3 '>
                        <SearchInput
                            placeholder="Buscar..."
                            onSearch={handleSearch}

                        />
                        <button
                            className='flex items-center bg-primary-light text-sm text-white px-3 h-8 rounded hover:bg-blue-700 gap-2'
                            onClick={handleOpenModal}
                        >
                            <span><FaPlus className='h-3 w-3' /></span>
                            <span className='hidden md:flex flex-wrap' >Novo instituto</span>
                        </button>
                        <div className='flex gap-x-2 items-center'>
                            <label className='flex items-center border border-primary-light text-primary-light text-sm bg-white px-3 h-8 rounded hover:bg-blue-100 gap-2 cursor-pointer'>
                                <span><FaUpload className='h-3 w-3' /></span>
                                <span className='hidden md:flex'>Enviar planilha</span>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    //onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                    id='fileUpload'
                                />
                            </label>
                            <span className='flex text-xs md:text-sm text-primary-dark flex-wrap'>Envie uma planilha com novos institutos</span>
                        </div>
                    </div>

                    <div className='flex flex-col py-4 rounded-md bg-white'>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm md:text-base font-medium text-gray-800 mt-3 mb-6">Lista de institutos</p>
                            <p className="flex text-sm text-primary-dark mb-2">Total de institutos: </p>
                        </div>
                        <div className="flex text-sm font-medium text-primary-dark md:justify-none justify-between  px-3 border-b border-gray-300 py-2">
                            <p className="flex flex-col md:w-1/2" >Nome</p>
                            <p className="flex flex-col md:w-1/2">Sigla</p>
                            <p className='flex flex-col md:w-1/2'>Unidade</p>
                            <p className='flex flex-col md:w-1/3'>Campus</p>
                            <p>Ações</p>
                        </div>
                        <div className="flex flex-col ">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col md:flex-row px-2 py-3.5  text-primary-dark text-sm bg-white border-b border-gray-300 hover:bg-blue-50 uppercase"
                                    >
                                        <div className="flex flex-col md:w-1/2">
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="flex flex-col md:w-1/2">
                                            <span>{item.acronym}</span>
                                        </div>
                                        <div className='flex flex-col md:w-1/2'>
                                            <span>{item.unit}</span>
                                        </div>
                                        <div className='flex flex-col md:w-1/3'>
                                            <span>{item.campus}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 justify-end">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="text-primary-light hover:text-blue-500"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className="text-primary-light hover:text-blue-500"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-primary-dark py-4">
                                    Nenhum registro encontrado.
                                </div>
                            )}
                        </div>

                    </div>

                </div>
                {showModal && <InstituteModal onClose={handleCloseModal}
                    instituteData={selectedInstitute} />}

                {showConfirmationModal && (
                    <ConfirmationModal
                        title="Excluir instituto"
                        message="Tem certeza que deseja excluir este instituto?"
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
    )
}