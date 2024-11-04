import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MultiSelect = ({ label, options, onChange, disabled, selectedValues = [], className, errorMessage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev); // Alterna a visibilidade
    };

    const handleSelectOption = (option) => {
        const alreadySelected = selectedValues.find((item) => item.value === option.value);
        let updatedSelections;

        if (alreadySelected) {
            updatedSelections = selectedValues.filter((item) => item.value !== option.value);
        } else {
            updatedSelections = [...selectedValues, option];
        }

        onChange(updatedSelections); // Passa as opções atualizadas para o componente pai
    };

    const isSelected = (option) => selectedValues.some((item) => item.value === option.value);

    return (
        <div className="w-full mb-4">
            <label className="block text-primary-dark text-xs md:text-sm font-normal mb-2">
                {label}
            </label>
            <div className="relative">
                <button
                    className={`appearance-none w-full border text-gray-400 px-4 h-9 md:h-10 rounded leading-tight focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center my-1 text-sm italic ${disabled ? 'bg-gray-100 border-none' : 'bg-white'} ${className}`}
                    onClick={handleToggle}
                    type="button"
                    disabled={disabled}
                >
                    {selectedValues.length > 0
                        ? selectedValues.map((option) => option.label).join(', ')
                        : 'Selecione'}
                    {isOpen ? <FaChevronUp className={`h-4 w-4 text-primary-light ${disabled ? 'opacity-50 cursor-not-allowed' : ''} `} /> : <FaChevronDown className={`h-4 w-4 text-primary-light ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} />}
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                    checked={isSelected(option)}
                                    onChange={() => handleSelectOption(option)}
                                    disabled={disabled}
                                />
                                <span className="ml-2 text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
            {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
        </div>
    );
};

export default MultiSelect;
