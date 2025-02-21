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
import MessageCard from '../../cards/menssegeCard';

const TabsAndList = () => {
    const [osData, setOsData] = useState([]);
    const [activeTab, setActiveTab] = useState('Abertas');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                console.log("OS Data:", data); 

                const calculatedData = data.map((item) => {
                    const valorRisco = calcularValorRisco(item.classification, item.maintenanceIndicators);
                    const prioridadeCalculada = calcularPrioridade(valorRisco);
    
                    return {
                        ...item,
                        valorRisco,
                        prioridade: prioridadeCalculada,
                    };
                });
    
                setOsData(calculatedData); 
            } catch (error) {
                console.error("Erro ao buscar ordens de serviço:", error);
                setOsData([]); 
            }
        };
    
        fetchOrders();
    }, []);
    
    
    const handleProgramClick = async (id) => {
        navigate(`/programing/${id}`);
    
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

    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem('appliedFilters')) || {};
        setAppliedFilters(savedFilters); 
    }, []);
    

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
            'Atendidas': 'Atendida',
            'Finalizadas': 'Finalizado',
            'Negadas': 'Negada'
        };

        let filtered = osData.filter(item => item.status === statusMap[activeTab]);

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.id.toString().includes(searchTerm) ||
                item.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.typeMaintenance.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.maintenanceUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.requisition.toString().includes(searchTerm)
            );
        }

        if (appliedFilters) {
            if (appliedFilters.date) {
                filtered = filtered.filter(item => item.date === appliedFilters.date);
            }
        
            if (appliedFilters.campus && appliedFilters.campus.length > 0) {
                filtered = filtered.filter(item =>
                    appliedFilters.campus.some(unit =>
                        item.maintenanceUnit.trim().toLowerCase() === unit.value.trim().toLowerCase()
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

            if (appliedFilters.professionals && appliedFilters.professionals.length > 0) {
                filtered = filtered.filter(item => {
                    if (!item.programings || item.programings.length === 0) {
                        return false; 
                    }
                    return item.programings.some(programing =>
                        appliedFilters.professionals.some(prof =>
                            programing.worker.toLowerCase().includes(prof.value.toLowerCase())
                        )
                    );
                });
            }
            
            
        }        

        filtered = filtered.sort((a, b) => {
            if (a.typeTreatment === 'adm' && b.typeTreatment !== 'adm') {
                return -1; 
            }
            if (b.typeTreatment === 'adm' && a.typeTreatment !== 'adm') {
                return 1; 
            }
        
            return b.valorRisco - a.valorRisco;
        });

        return filtered;
    };

    const memoizedFilteredData = useMemo(() => filterData(), [osData, appliedFilters, searchTerm, activeTab]);

    const handleDeleteItem = (id) => {
        const updatedData = osData.filter(item => item.id !== id);
        setOsData(updatedData); 
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
        <div className="flex w-full flex-col">
            <div className='flex flex-row gap-x-2 px-2 md:px-6'>
                <SearchInput placeholder="Buscar..." onSearch={handleSearch} />
                
                <button
                    onClick={() => navigate("../form")}
                    className="flex items-center gap-2 bg-primary-light text-white px-3.5 md:px-4 h-10 rounded-lg hover:bg-green-700"
                >
                    <span>
                        <FaPlus className='h-3 w-3' />
                    </span>
                    <span className='hidden md:block text-sm'>Nova OS</span>
                </button>
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-primary-light border border-primary-light px-3.5 md:px-4 h-10 rounded-lg hover:bg-green-100 hover:border-primary-light"
                >
                    <span>
                        <FaSlidersH className='h-3 w-3' />
                    </span>
                    <span className='hidden md:block text-sm'>Filtrar</span>
                </button>
            </div>
            <div className="flex flex-wrap mb-1.5 px-0 md:px-6">
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

            <div className="flex flex-col justify-center items-center w-full overflow-auto px-2 md:px-6 mt-2 gap-y-1">
                <MessageCard
                    type="info"
                    title="Info."
                    message="OS marcadas com um ponto no canto superior direito indicam sua ordem de prioridade. Para melhor compreensão acesse a [Matriz de prioridade](https://drive.google.com/file/d/15nGBFHLrG-dJbyvVE7_TgS__UarLPhXA/view?usp=sharing) "
                    storageKey="showMandatoryMessage"
                />
                <MessageCard
                    type="info"
                    title="Info."
                    message="OS marcadas com um 'ADM' no canto superior direito indicam alta prioridade."
                    storageKey="showMessageADM"
                />
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className='flex items-center justify-center'>
                <div className="flex w-full justify-between bg-white text-center items-center mt-1 px-4 text-xs text-primary-dark mx-4">
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

            <div className="w-full px-2 md:px-6">
                <List 
                filteredData={currentItems} 
                setFilteredData={setFilteredData} 
                onProgramClick={handleProgramClick} 
                onDeleteItem={handleDeleteItem}
                />
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
