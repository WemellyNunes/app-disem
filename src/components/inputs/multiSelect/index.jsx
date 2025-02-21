import { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MultiSelect = ({ label, options, onChange, disabled, selectedValues = [], className, errorMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelectOption = (option) => {
        const alreadySelected = selectedValues.find((item) => item.value === option.value);
        let updatedSelections;

        if (alreadySelected) {
            updatedSelections = selectedValues.filter((item) => item.value !== option.value);
        } else {
            updatedSelections = [...selectedValues, option];
        }

        onChange(updatedSelections);
    };

    const isSelected = (option) => selectedValues.some((item) => item.value === option.value);

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="w-full mb-4" ref={dropdownRef}>
            <label className="block text-primary-dark text-sm font-normal mb-2">
                {label}
            </label>
            <div className="relative">
                <button
                    className={`appearance-none w-full border border-gray-400 px-4 h-10 rounded leading-tight focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center my-1 text-sm italic ${disabled ? 'bg-gray-50 border-none text-gray-400' : 'bg-white text-gray-500'} ${className}`}
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
