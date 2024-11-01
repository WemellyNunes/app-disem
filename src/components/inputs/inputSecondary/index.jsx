import { forwardRef } from "react"; 

const InputSecondary = forwardRef(({ label, placeholder, buttonIcon, onButtonClick, type = 'text', onChange, className, disabled, value, errorMessage }, ref) => {
    return (
        <div className="w-full ">
            <label className="block text-primary-dark text-xs md:text-sm font-normal mb-1" htmlFor="inputWithButton">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    className={`appearance-none block w-full text-gray-700 border border-gray-300 rounded h-9 md:h-10 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500
                    focus:border-blue-500 my-1 text-xs md:text-sm italic ${disabled ? 'bg-gray-100 border-none text-gray-400' : 'bg-white'} ${className}`}
                    id="inputWithButton"
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    ref={ref} // Aqui é onde a referência é passada
                    disabled={disabled}
                />
                <button
                    onClick={onButtonClick}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 text-primary-light focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {buttonIcon}
                </button>
            </div>
            {/* Exibir mensagem de erro se houver */}
            {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
        </div>
    );
});

export default InputSecondary;
