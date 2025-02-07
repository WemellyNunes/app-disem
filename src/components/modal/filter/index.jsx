import { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import DateTimePicker from "../../inputs/dateTimePicker";
import MultiSelect from "../../inputs/multiSelect";
import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import { getAllTeams } from '../../../utils/api/api';

const FilterModal = ({ isOpen, onClose, onApplyFilters, appliedFilters }) => {

  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
        try {
            const data = await getAllTeams();
            const formattedProfessionals = data.map((team) => ({
                label: `${team.name.toUpperCase()} - ${team.role.toUpperCase()}`,
                value: team.name
            }));
            setProfessionals(formattedProfessionals);
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        }
    };
    fetchProfessionals();
}, []);

  const options = [
    { label: 'UNIDADE I - MARABÁ', value: 'UNIDADE I - MARABÁ' },
    { label: 'UNIDADE II - MARABÁ', value: 'UNIDADE II - MARABÁ' },
    { label: 'UNIDADE III - MARABÁ', value: 'UNIDADE III - MARABÁ' },
    { label: 'UNIDADE SANTANA DO ARAGUAIA', value: 'UNIDADE SANTANA DO ARAGUAIA' },
    { label: 'UNIDADE SÃO FELIX DO XINGU', value: 'UNIDADE SÃO FELIX DO XINGU' },
    { label: 'UNIDADE RONDON', value: 'UNIDADE RONDON' },
    { label: 'UNIDADE XINGUARA', value: 'UNIDADE XINGUARA' },
  ];

  const system = [
    { label: 'CIVIL', value: 'CIVIL' },
    { label: 'ELETRICO', value: 'ELETRICO' },
    { label: 'HIDROSANITARIO', value: 'HIDROSANITARIO' },
    { label: 'REFRIGERAÇÃO', value: 'REFRIGERAÇÃO' },
    { label: 'MISTO', value: 'MISTO' },
  ];

  const maintence = [
    { label: 'CORRETIVA', value: 'CORRETIVA' },
    { label: 'PREVENTIVA', value: 'PREVENTIVA' },
  ];

  const origin = [
    { label: 'DISEM', value: 'DISEM' },
    { label: 'SIPAC', value: 'SIPAC' },
  ];

  const [filters, setFilters] = useState({
    requisition: '',
    date: '',
    requester: '',
    typeMaintenance: [],
    system: [],
    origin: [],
    campus: []
  });

  const inputRef = useRef(null);

  const handleDateChange = (date) => {
    setFilters({ ...filters, date });
  };

  const handleMultiSelectChange = useCallback((name, selectedOptions) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: selectedOptions,
    }));
  }, []);

  const handleApplyFilters = () => {
    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value && value.length > 0)
    );
    onApplyFilters(validFilters);
    onClose();
  };


  useEffect(() => {
    if (appliedFilters) {
      setFilters(appliedFilters);
    }
  }, [appliedFilters]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 mx-4 md:mx-0 rounded-md shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm md:text-base font-medium text-primary-dark">Filtrar por:</h3>
          <button onClick={onClose}>
            <FaTimes className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="space-y-4">
          <DateTimePicker
            label="Data de criação"
            placeholder="00/00/0000"
            onDateChange={handleDateChange}
            value={filters.date}
          />
          <MultiSelect
            label="Unidade"
            options={options}
            onChange={(selectedOptions) => handleMultiSelectChange('campus', selectedOptions)}
            selectedValues={filters.campus}
          />
          <MultiSelect
            label="Sistemas"
            options={system}
            onChange={(selectedOptions) => handleMultiSelectChange('system', selectedOptions)}
            selectedValues={filters.system}
          />
          <MultiSelect
            label="Profissionais"
            options={professionals}
            onChange={(selectedOptions) => handleMultiSelectChange('professionals', selectedOptions)}
            selectedValues={filters.professionals}
          />
          <MultiSelect
            label="Tipo de manutenção"
            options={maintence}
            onChange={(selectedOptions) => handleMultiSelectChange('typeMaintenance', selectedOptions)}
            selectedValues={filters.typeMaintenance}
          />
          <MultiSelect
            label="Origem"
            options={origin}
            onChange={(selectedOptions) => handleMultiSelectChange('origin', selectedOptions)}
            selectedValues={filters.origin}
          />
        </div>

        <div className="flex justify-between mt-10">
          <ButtonSecondary onClick={onClose}>Cancelar</ButtonSecondary>
          <ButtonPrimary onClick={handleApplyFilters}>Adicionar</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
