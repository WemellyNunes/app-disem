import { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputSecondary = forwardRef(
    ({ label, placeholder, buttonIcon, onButtonClick, type = 'text', onChange, className, disabled, value, errorMessage }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className="w-full">
                <label className="block text-primary-dark text-sm font-normal mb-1" htmlFor="inputWithButton">
                    {label}
                </label>
                <div className="relative flex items-center">
                    <input
                        className={`appearance-none block w-full text-primary-dark border border-gray-400 rounded h-11 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500 my-1 text-xs md:text-sm italic ${disabled ? 'bg-gray-50 border-none text-gray-' : 'bg-white'} ${className}`}
                        type={showPassword ? 'text' : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange ? (e) => onChange(e) : undefined}
                        ref={ref}
                        disabled={disabled}
                        maxLength={type === "password" ? 64 : undefined}
                    />
                
                    {type === "password" && (
                        <button
                            onClick={togglePasswordVisibility}
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    )}

                    {type !== "password" && buttonIcon && (
                        <button
                            onClick={onButtonClick}
                            className={`absolute inset-y-0 right-0 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                        >
                            {buttonIcon}
                        </button>
                    )}
                </div>
                {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
            </div>
        );
    }
);

export default InputSecondary;
