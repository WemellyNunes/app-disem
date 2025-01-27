import { useState, useEffect } from "react";
import PageTitle from "../../components/title";
import InfraModal from "../../components/modal/infra";
import ListInstitute from "../../components/list/listInstitute";
import ListUnit from "../../components/list/listUnit";
import Tabs from "../../components/list/tabs";
import SearchInput from "../../components/inputs/searchInput";
import MessageBox from "../../components/box/message";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../../components/modal/confirmation";

import { getAllInstitutes, getAllUnits, deleteInstitute, deleteUnit } from "../../utils/api/api";

export default function InfraPage() {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [activeTab, setActiveTab] = useState(0); 
    const [institutes, setInstitutes] = useState([]);
    const [units, setUnits] = useState([]);
    const [filteredInstitutes, setFilteredInstitutes] = useState([]);
    const [filteredUnits, setFilteredUnits] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);

    const tabs = [
        { label: "Unidades" },
        { label: "Institutos" },
    ];

    const fetchData = async () => {
        try {
            const [instituteData, unitData] = await Promise.all([getAllInstitutes(), getAllUnits()]);

            const sortedInstitutes = instituteData.sort((a, b) => a.id - b.id);
            setInstitutes(sortedInstitutes);
            setFilteredInstitutes(sortedInstitutes);

            const sortedUnits = unitData.sort((a, b) => a.id - b.id);
            setUnits(sortedUnits);
            setFilteredUnits(sortedUnits);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (activeTab === 0) {
            setFilteredUnits(
                term
                    ? units.filter((unit) =>
                          unit.unit.toLowerCase().includes(term.toLowerCase()) || 
                          unit.campus.toLowerCase().includes(term.toLowerCase())
                      )
                    : units
            );
        } else {
            setFilteredInstitutes(
                term
                    ? institutes.filter((institute) =>
                          institute.name.toLowerCase().includes(term.toLowerCase()) ||
                          institute.acronym.toLowerCase().includes(term.toLowerCase())
                      )
                    : institutes
            );
        }
    };

    const handleModalClose = (updatedData, type) => {
        setShowModal(false);
    
        if (updatedData) {
            if (type === "unidade") {
                // Atualiza ou adiciona uma unidade na lista
                setUnits((prev) => {
                    const exists = prev.some((unit) => unit.id === updatedData.id);
                    return exists
                        ? prev.map((unit) => (unit.id === updatedData.id ? updatedData : unit))
                        : [updatedData, ...prev];
                });
                setFilteredUnits((prev) => {
                    const exists = prev.some((unit) => unit.id === updatedData.id);
                    return exists
                        ? prev.map((unit) => (unit.id === updatedData.id ? updatedData : unit))
                        : [updatedData, ...prev];
                });
            } else if (type === "instituto") {
                // Atualiza ou adiciona um instituto na lista
                setInstitutes((prev) => {
                    const exists = prev.some((institute) => institute.id === updatedData.id);
                    return exists
                        ? prev.map((institute) => (institute.id === updatedData.id ? updatedData : institute))
                        : [updatedData, ...prev];
                });
                setFilteredInstitutes((prev) => {
                    const exists = prev.some((institute) => institute.id === updatedData.id);
                    return exists
                        ? prev.map((institute) => (institute.id === updatedData.id ? updatedData : institute))
                        : [updatedData, ...prev];
                });
            }
    
        }
    };
    
    
    

    const handleDeleteClick = (item) => {
        setDataToDelete(item); // Define o item a ser deletado
        setShowConfirmationModal(true); // Abre o modal de confirmação
    };

    const handleConfirmDelete = async () => {
        try {
            if (activeTab === 0) {
                // Exclui unidade
                await deleteUnit(dataToDelete.id);
                setUnits((prev) => prev.filter((unit) => unit.id !== dataToDelete.id));
                setFilteredUnits((prev) => prev.filter((unit) => unit.id !== dataToDelete.id));
            } else {
                // Exclui instituto
                await deleteInstitute(dataToDelete.id);
                setInstitutes((prev) => prev.filter((institute) => institute.id !== dataToDelete.id));
                setFilteredInstitutes((prev) =>
                    prev.filter((institute) => institute.id !== dataToDelete.id)
                );
            }

            setMessageContent({
                type: "success",
                title: "Sucesso",
                message: `${activeTab === 0 ? "Unidade" : "Instituto"} excluído com sucesso.`,
            });
            setShowMessageBox(true);
            setTimeout(() => setShowMessageBox(false), 1000); 

            setDataToDelete(null);
            setShowConfirmationModal(false);
        } catch (error) {
            console.error("Erro ao deletar item:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <PageTitle
                    text="Unidades e institutos"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />

                <div className="pt-3 px-2 md:px-6">
                    <div className="flex flex-row gap-x-2 mb-4">
                        <SearchInput
                            placeholder="Buscar..."
                            onSearch={handleSearch}
                        />
                        <button
                            className="flex items-center bg-primary-light text-sm text-white px-3.5 md:px-4 h-9 rounded-lg hover:bg-blue-700 gap-2"
                            onClick={() => {
                                setShowModal(true);
                                setSelectedData(null); 
                            }}
                        >
                            <FaPlus className="h-3 w-3" />
                            <span className="hidden md:flex flex-wrap">
                                Cadastrar
                            </span>
                        </button>
                    </div>

                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(index) => {
                            setActiveTab(index);
                            setSearchTerm("");
                        }}
                    />

                    <div className="mt-4">
                        {activeTab === 0 && (
                            <ListUnit
                                filteredData={filteredUnits}
                                handleEditClick={(unit) => {
                                    setSelectedData({ ...unit, type: "unidade" });
                                    setShowModal(true);
                                }}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {activeTab === 1 && (
                            <ListInstitute
                                filteredData={filteredInstitutes}
                                handleEditClick={(institute) => {
                                    setSelectedData({ ...institute, type: "instituto" });
                                    setShowModal(true);
                                }}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                    </div>
                </div>

                {showModal && (
                    <InfraModal
                        onClose={handleModalClose}
                        data={selectedData}
                        isEditing={!!selectedData}
                    />
                )}

                {showConfirmationModal && (
                    <ConfirmationModal
                        title="Excluir Item"
                        message={`Tem certeza que deseja excluir este ${activeTab === 0 ? "unidade" : "instituto"
                            }?`}
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
