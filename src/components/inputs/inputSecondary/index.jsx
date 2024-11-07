import { forwardRef, useState } from "react"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const InputSecondary = forwardRef(({ label, placeholder, buttonIcon, onButtonClick, type = 'text', onChange, className, disabled, value, errorMessage }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (type === "password" && inputValue.length > 6) {
            return; 
        }
        onChange(inputValue);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full">
            <label className="block text-primary-dark text-xs md:text-sm font-normal mb-1" htmlFor="inputWithButton">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    className={`appearance-none block w-full text-gray-700 border border-gray-300 rounded h-9 md:h-10 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500 my-1 text-xs md:text-sm italic ${disabled ? 'bg-primary-gray border-none text-gray-400' : 'bg-white'} ${className}`}
                    id="inputWithButton"
                    type={showPassword ? 'text' : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    ref={ref}
                    disabled={disabled}
                    maxLength={type === "password" ? 6 : undefined} // Limite de 6 caracteres
                />
                <button
                    onClick={type === "password" ? togglePasswordVisibility : onButtonClick}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {type === "password" ? (showPassword ? <FaEyeSlash /> : <FaEye />) : buttonIcon}
                </button>
            </div>
            {/* Exibir mensagem de erro se houver */}
            {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
        </div>
    );
});

export default InputSecondary;
