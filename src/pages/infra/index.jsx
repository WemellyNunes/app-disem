import { useState, useEffect } from "react";
import PageTitle from "../../components/title";
import SearchInput from "../../components/inputs/searchInput";
import MessageBox from "../../components/box/message";
import InfraModal from "../../components/modal/infra";
import ListInstitute from "../../components/list/listInstitute";
import ListUnit from "../../components/list/listUnit";
import Tabs from "../../components/list/tabs";

import { FaPlus, FaUpload } from "react-icons/fa";
import { getAllInstitutes, getAllUnits, deleteInstitute, deleteUnit } from "../../utils/api/api"; // Funções para unidades e institutos

export default function InfraPage() {
    const [showModal, setShowModal] = useState(false);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageContent, setMessageContent] = useState({ type: "", title: "", message: "" });
    const [activeTab, setActiveTab] = useState(0); // 0 = Unidades, 1 = Institutos
    const [institutes, setInstitutes] = useState([]);
    const [units, setUnits] = useState([]);
    const [filteredInstitutes, setFilteredInstitutes] = useState([]);
    const [filteredUnits, setFilteredUnits] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const tabs = [
        { label: "Unidades" },
        { label: "Institutos" },
    ];

    // Fetch de Institutos
    const fetchInstitutes = async () => {
        try {
            const data = await getAllInstitutes();
            const sortedInstitutes = data.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setInstitutes(sortedInstitutes);
            setFilteredInstitutes(sortedInstitutes);
        } catch (error) {
            console.error("Erro ao buscar os institutos:", error);
        }
    };

    // Fetch de Unidades
    const fetchUnits = async () => {
        try {
            const data = await getAllUnits();
            const sortedUnits = data.sort((a, b) =>
                a.unit.toLowerCase().localeCompare(b.unit.toLowerCase())
            );
            setUnits(sortedUnits);
            setFilteredUnits(sortedUnits);
        } catch (error) {
            console.error("Erro ao buscar as unidades:", error);
        }
    };

    // Fetch inicial
    useEffect(() => {
        fetchInstitutes();
        fetchUnits();
    }, []);

    // Filtrar dados com base na aba ativa
    const filterData = (term) => {
        if (activeTab === 0) {
            // Filtrar Unidades
            if (!term) {
                setFilteredUnits(units);
            } else {
                const filtered = units.filter((item) =>
                    item.unit.toLowerCase().includes(term.toLowerCase()) ||
                    item.campus.toLowerCase().includes(term.toLowerCase())
                );
                setFilteredUnits(filtered);
            }
        } else {
            if (!term) {
                setFilteredInstitutes(institutes);
            } else {
                const filtered = institutes.filter((item) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.acronym.toLowerCase().includes(term.toLowerCase()) ||
                    item.campus.toLowerCase().includes(term.toLowerCase()) 
                );
                setFilteredInstitutes(filtered);
            }
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterData(term);
    };

    return (
        <>
            <div className="flex flex-col">
                <PageTitle
                    text="Institutos e Unidades"
                    backgroundColor="bg-white"
                    textColor="text-primary-dark"
                />

                <div className="pt-3 px-2 md:px-6">
                    <div className="flex flex-row gap-x-2 mb-3">
                        <SearchInput
                            placeholder="Buscar..."
                            onSearch={handleSearch}
                        />
                        <button
                            className="flex items-center bg-primary-light text-sm text-white px-3 h-8 rounded hover:bg-blue-700 gap-2"
                            onClick={() => setShowModal(true)}
                        >
                            <FaPlus className="h-3 w-3" />
                            <span className="hidden md:flex flex-wrap">
                                {activeTab === 0 ? "Nova Unidade" : "Novo Instituto"}
                            </span>
                        </button>
                       
                    </div>

                    {/* Tabs */}
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
                                handleEditClick={(unit) => console.log("Edit Unit:", unit)}
                                handleDeleteClick={(unit) => console.log("Delete Unit:", unit)}
                            />
                        )}
                        {activeTab === 1 && (
                            <ListInstitute
                                filteredData={filteredInstitutes}
                                handleEditClick={(institute) => console.log("Edit Institute:", institute)}
                                handleDeleteClick={(institute) => console.log("Delete Institute:", institute)}
                            />
                        )}
                    </div>
                </div>

                {showModal && (
                    <InfraModal onClose={() => setShowModal(false)} />
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
