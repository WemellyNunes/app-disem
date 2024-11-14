import { FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const MessageCard = ({ type, title, message, storageKey }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasShownMessage = localStorage.getItem(storageKey);
        if (!hasShownMessage) {
            setIsVisible(true);
            localStorage.setItem(storageKey, 'true');
        }
    }, [storageKey]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const iconTypes = {
        warning: <FaExclamationCircle className="text-yellow-500" />,
        info: <FaInfoCircle className="text-primary-light" />
    };

    const backgroundTypes = {
        warning: 'bg-yellow-200',
        info: 'bg-blue-200'
    };

    return (
        <div className="flex justify-center items-start w-full ">
            <div className={` py-4 px-2 md:px-6 ${backgroundTypes[type]} flex items-center justify-between w-full rounded`}>
                <div className="flex items-center space-x-3">
                    {iconTypes[type]}
                    <div className="flex items-center space-x-2">
                        <span className='text-primary-dark text-xs md:text-sm font-medium'>{title}</span>
                        <span className="text-primary-dark text-xs md:text-sm font-normal ">{message}</span>
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