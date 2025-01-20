

import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const MessageBox = ({ type, title, message, onClose }) => {
    const iconTypes = {
        success: <FaCheckCircle className="text-status-resp" />,
        error: <FaTimesCircle className="text-primary-red" />,
        warning: <FaExclamationCircle className="text-yellow-500" />,
        info: <FaInfoCircle className="text-primary-light" />
    };

    const backgroundTypes = {
        success: 'bg-green-200',
        error: 'bg-red-200',
        warning: 'bg-yellow-200',
        info: 'bg-blue-200'
    };

    return (
        <div className="fixed inset-0 flex justify-center  mt-2 items-start z-50 md:mx-24">
            <div className={`relative w-full py-6 px-2 md:px-6  shadow-lg ${backgroundTypes[type]} flex items-center justify-between rounded-xl`}>
                <div className="flex items-center space-x-3">
                    {iconTypes[type]}
                    <div className="flex items-center space-x-1">
                        <span className='text-primary-dark text-sm md:text-base font-medium'>{title}</span>
                        <span className="text-primary-dark text-sm md:text-base font-normal">{message}</span>
                    </div>
                </div>
                <button onClick={onClose}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                </button>
            </div>
        </div>
    );
};

export default MessageBox;