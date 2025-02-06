import { FaExclamationCircle, FaInfoCircle, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const MessageCard = ({ type, message, storageKey }) => {
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem(storageKey) !== 'hidden';
    });

    useEffect(() => {
        if (isVisible) {
            localStorage.setItem(storageKey, 'visible');
        }
    }, [isVisible, storageKey]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem(storageKey, 'hidden');
    };

    if (!isVisible) return null;

    const iconTypes = {
        warning: <FaExclamationCircle className="text-yellow-500" />,
        info: <FaInfoCircle className="text-blue-700" />
    };

    const backgroundTypes = {
        warning: 'bg-yellow-50 border border-yellow-500',
        info: 'bg-blue-50 border border-blue-600'
    };

    // Função para transformar "[texto do link](URL)" em links clicáveis
    const parseMessage = (msg) => {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        const parts = [];
        let lastIndex = 0;

        msg.replace(linkRegex, (match, text, url, offset) => {
            // Adiciona o texto antes do link
            parts.push(msg.substring(lastIndex, offset));

            // Adiciona o link formatado
            parts.push(
                <a 
                    key={offset} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 font-medium underline flex items-center space-x-1"
                >
                    <span>{text}</span>
                    <FaExternalLinkAlt className="w-3 h-3 inline" />
                </a>
            );

            lastIndex = offset + match.length;
        });

        parts.push(msg.substring(lastIndex));
        return parts;
    };

    return (
        <div className="flex flex-row justify-center items-center w-full">
            <div className={`flex items-center py-3 px-4 md:px-6 border rounded-lg justify-between w-full ${backgroundTypes[type]} text-sm md:text-base text-gray-900`}>
                <div className="flex items-center space-x-3 w-full">
                    {iconTypes[type]}
                    <div className="flex items-center">
                        <span className="flex gap-x-1 text-primary-dark text-sm">{parseMessage(message)}</span>
                    </div>
                </div>
                <button onClick={handleClose}>
                    <FaTimes className="text-gray-500 hover:text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default MessageCard;
