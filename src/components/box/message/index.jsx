import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const MessageBox = ({ type, title, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true); // Ativa a animação ao montar o componente
    }, []);

    const handleClose = () => {
        setIsVisible(false); // Inicia a animação de saída
        setTimeout(onClose); // Aguarda a animação antes de remover o componente
    };

    const iconTypes = {
        success: <FaCheckCircle className="text-status-resp" />,
        error: <FaTimesCircle className="text-primary-red" />,
        warning: <FaExclamationCircle className="text-yellow-500" />,
        info: <FaInfoCircle className="text-primary-light" />,
    };

    const backgroundTypes = {
        success: "bg-green-200",
        error: "bg-red-200",
        warning: "bg-yellow-200",
        info: "bg-blue-200",
    };

    return (
        <div
            className={`fixed inset-0 flex justify-center items-start z-50 transition-transform duration-300 ${
                isVisible ? "translate-y-1 opacity-100" : "-translate-y-10 opacity-0"
            }`}
        >
            <div className={`relative w-full md:w-8/12 py-6 px-2 md:px-6 shadow-lg ${backgroundTypes[type]} flex items-center justify-between rounded-xl`}>
                <div className="flex items-center space-x-3">
                    {iconTypes[type]}
                    <div className="flex items-center space-x-1">
                        <span className="text-primary-dark text-sm md:text-base font-medium">{title}</span>
                        <span className="text-primary-dark text-sm md:text-base font-normal">{message}</span>
                    </div>
                </div>
                <button onClick={handleClose}>
                    <FaTimes className="text-gray-500 hover:text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default MessageBox;
