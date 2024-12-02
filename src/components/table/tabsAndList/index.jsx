import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '../tabs';
import SearchInput from '../../inputs/searchInput';
import FilterModal from '../../modal/filter';
import Tag from '../../tag';
import { FaSlidersH, FaPlus } from "react-icons/fa";
import List from '../list';
import { getAllOrders } from "../../../utils/api/api";
import { calcularValorRisco, calcularPrioridade } from '../../../utils/matriz';
import { MdNavigateNext, MdNavigateBefore  } from "react-icons/md";


const TabsAndList = () => {
    const [osData, setOsData] = useState([]);
    const [activeTab, setActiveTab] = useState('Abertas');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                console.log("OS Data:", data); // Agora retorna uma lista completa
    
                // Realiza o cálculo de impacto e prioridade para cada item
                const calculatedData = data.map((item) => {
                    const valorRisco = calcularValorRisco(item.classification, item.maintenanceIndicators);
                    const prioridadeCalculada = calcularPrioridade(valorRisco);
    
                    return {
                        ...item,
                        valorRisco,
                        prioridade: prioridadeCalculada,
                    };
                });
    
                setOsData(calculatedData); // Atualiza o estado com os dados calculados
            } catch (error) {
                console.error("Erro ao buscar ordens de serviço:", error);
                setOsData([]); // Garante que o estado seja um array vazio em caso de erro
            }
        };
    
        fetchOrders();
    }, []);
    
    
    const handleProgramClick = async (id) => {
        navigate(`/programing/${id}`);
    
        // Atualiza o estado local para refletir a mudança
        const updatedData = osData.map((item) =>
            item.id === id ? { ...item, programingId: true } : item
        );
        setOsData(updatedData);

        setFilteredData(filterData(updatedData));
    };
    

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
        setIsFilterModalOpen(false);
        localStorage.setItem('appliedFilters', JSON.stringify(filters));
    };

    const removeFilter = (filterKey, filterValue = null) => {
        setAppliedFilters((prev) => {
            const updatedFilters = { ...prev };

            if (filterValue && Array.isArray(updatedFilters[filterKey])) {
                updatedFilters[filterKey] = updatedFilters[filterKey].filter((item) => item !== filterValue);

                if (updatedFilters[filterKey].length === 0) {
                    delete updatedFilters[filterKey];
                }
            } else {
                delete updatedFilters[filterKey];
            }
            localStorage.setItem('appliedFilters', JSON.stringify(updatedFilters));

            return updatedFilters;
        });
    };

    const filterData = () => {
        if (!Array.isArray(osData)) {
            console.error("osData não é um array:", osData);
            return [];
        }

        const statusMap = {
            'Abertas': 'A atender',
            'Programadas': 'Em atendimento',
            'Resolvidas': 'Resolvido',
            'Finalizadas': 'Finalizada',
            'Negadas': 'Negada'
        };

        let filtered = osData.filter(item => item.status === statusMap[activeTab]);

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.id.toString().includes(searchTerm) ||
                item.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.typeMaintenance.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.maintenanceUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.origin.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (appliedFilters) {
            if (appliedFilters.date) {
                filtered = filtered.filter(item => item.date === appliedFilters.date);
            }
        
            if (appliedFilters.maintenanceUnit && appliedFilters.maintenanceUnit.length > 0) {
                filtered = filtered.filter(item =>
                    appliedFilters.maintenanceUnit.some(unit =>
                        item.maintenanceUnit.toLowerCase().includes(unit.value.toLowerCase())
                    )
                );
            }
        
            if (appliedFilters.typeMaintenance && appliedFilters.typeMaintenance.length > 0) {
                filtered = filtered.filter(item =>
                    appliedFilters.typeMaintenance.some(tipo =>
                        item.typeMaintenance.toLowerCase().includes(tipo.value.toLowerCase())
                    )
                );
            }
        
            if (appliedFilters.system && appliedFilters.system.length > 0) {
                filtered = filtered.filter(item =>
                    appliedFilters.system.some(system =>
                        item.system.toLowerCase().includes(system.value.toLowerCase())
                    )
                );
            }
        
            if (appliedFilters.origin && appliedFilters.origin.length > 0) {
                filtered = filtered.filter(item =>
                    appliedFilters.origin.some(origin =>
                        item.origin.toLowerCase().includes(origin.value.toLowerCase())
                    )
                );
            }
        }        

        filtered = filtered.sort((a, b) => b.valorRisco - a.valorRisco);

        return filtered;
    };

    const memoizedFilteredData = useMemo(() => filterData(), [osData, appliedFilters, searchTerm, activeTab]);

    const handleDeleteItem = (id) => {
        const updatedData = osData.filter(item => item.id !== id);
        setOsData(updatedData); // Atualiza o estado principal
    };    
    
    useEffect(() => {
        setFilteredData(memoizedFilteredData);
    }, [memoizedFilteredData, osData]);
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="flex w-full flex-col mt-1">
            <div className='flex flex-row gap-x-2 px-2 md:px-6'>
                <SearchInput placeholder="Buscar..." onSearch={handleSearch} />
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-primary-light border border-gray-400 px-3 md:px-4 h-8 rounded hover:bg-blue-100 hover:border-primary-light"
                >
                    <span>
                        <FaSlidersH className='h-3 w-3' />
                    </span>
                    <span className='hidden md:block text-sm'>Filtrar</span>
                </button>
                <button
                    onClick={() => navigate("../form")}
                    className="flex items-center gap-2 bg-primary-light text-white px-3 md:px-4 h-8 rounded hover:bg-blue-700"
                >
                    <span>
                        <FaPlus className='h-3 w-3' />
                    </span>
                    <span className='hidden md:block text-sm'>Nova OS</span>
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-1.5 px-2 md:px-6">
                {Object.keys(appliedFilters).map((filterKey) => {
                    const filterValue = appliedFilters[filterKey];

                    if (Array.isArray(filterValue)) {
                        return filterValue.map((item) => (
                            <Tag
                                key={`${filterKey}-${item.value}`}
                                label={`${item.label}`}
                                onRemove={() => removeFilter(filterKey, item)}
                            />
                        ));
                    } else {
                        return (
                            <Tag
                                key={filterKey}
                                label={`${filterKey}: ${filterValue}`}
                                onRemove={() => removeFilter(filterKey)}
                            />
                        );
                    }
                })}
            </div>

            <div className="w-full overflow-auto px-2 md:px-6">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="w-full px-2 md:px-6">
                <List 
                filteredData={currentItems} 
                setFilteredData={setFilteredData} 
                onProgramClick={handleProgramClick} 
                onDeleteItem={handleDeleteItem}
                />
            </div>

            <div className='flex items-center justify-center'>
                <div className="flex fixed bottom-0 w-full md:w-1/2 justify-between bg-white text-center items-center shadow-md mt-6 px-4 text-xs text-primary-dark mx-40">
                    <div>{filteredData.length} itens de {filteredData.length}</div>
                    <div>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </select>
                    </div>
                    <div className='flex flex-row items-center'>
                        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className='text-primary-light'><MdNavigateBefore size={25}/></button>
                        <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}></button>
                        <span>{currentPage} de {totalPages}</span>
                        <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}></button>
                        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className='text-primary-light'><MdNavigateNext size={25}/></button>
                    </div>
                </div>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={handleApplyFilters}
                appliedFilters={appliedFilters}
            />
        </div>
    );
};

export default TabsAndList;
