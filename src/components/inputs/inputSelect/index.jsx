import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

const InputSelect = ({ label, options, onChange, value, disabled, className, errorMessage }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev); // Alterna a visibilidade
    };

    return (
        <div className="w-full mb-4">
            <label className="block text-primary-dark text-sm font-normal mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    className={`block appearance-none w-full border border-gray-400
                    h-11 px-4 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500 text-xs md:text-sm italic cursor-pointer my-1 ${disabled ? 'text-gray-800 bg-gray-50 border-none' : 'bg-white text-gray-500'} ${className} `}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={handleToggle}
                    value={value} 
                    disabled={disabled} 
                >
                    <option  value="" disabled>
                        Selecione
                    </option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-primary-dark px-2">
                {isOpen ? <FaChevronUp className={`h-4 w-4 text-primary-light ${disabled ? 'opacity-50 cursor-not-allowed text-white' : ''} `} /> : <FaChevronDown className={`h-4 w-4 text-primary-light ${disabled ? 'opacity-50 cursor-not-allowed text-white' : ''}`} />}
                </div>
            </div>
            {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
        </div>
    );
};

export default InputSelect;