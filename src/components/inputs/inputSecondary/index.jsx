import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash, FaRandom } from "react-icons/fa"; // Ícone para o botão de gerar senha

const InputSecondary = forwardRef(
    ({ label, placeholder, buttonIcon, onButtonClick, type = 'text', onChange, className, disabled, value, errorMessage, isEditing = false }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const handleInputChange = (e) => {
            const inputValue = e.target.value;
            if (type === "password" && inputValue.length > 50) {
                return; 
            }
            onChange(inputValue);
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const generateRandomPassword = () => {
            const randomPassword = Math.random().toString(36).slice(-10); 
            onChange(randomPassword);
        };

        return (
            <div className="w-full">
                <label className="block text-primary-dark text-sm font-normal mb-1" htmlFor="inputWithButton">
                    {label}
                </label>
                <div className="relative flex items-center">
                    <input
                        className={`appearance-none block w-full text-primary-dark border border-gray-400 rounded h-10 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500 my-1 text-xs md:text-sm italic ${disabled ? 'bg-gray-50 border-none text-gray-' : 'bg-white'} ${className}`}
                        id="inputWithButton"
                        type={showPassword ? 'text' : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleInputChange}
                        ref={ref}
                        disabled={disabled}
                        maxLength={type === "password" ? 50 : undefined} // Limite de 50 caracteres
                    />
                    {!isEditing && type === "password" && (
                        <button
                            onClick={generateRandomPassword}
                            className={`absolute inset-y-0 right-8 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                        >
                            <FaRandom /> {/* Botão para gerar senha aleatória */}
                        </button>
                    )}
                    <button
                        onClick={type === "password" ? togglePasswordVisibility : onButtonClick}
                        className={`absolute inset-y-0 right-0 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                    >
                        {type === "password" ? (showPassword ? <FaEyeSlash /> : <FaEye />) : buttonIcon}
                    </button>
                </div>
                {/* Exibir mensagem de erro se houver */}
                {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
            </div>
        );
    }
);

export default InputSecondary;
