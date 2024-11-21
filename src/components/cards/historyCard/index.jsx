import { FaTimes, FaCaretDown } from 'react-icons/fa';

const HistoryCard = ({ history, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-10 z-50 ">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/3 mx-1 md:mx-0">
                <div className="flex justify-between items-center">
                    <h2 className="text-base md:text-lg text-primary-light font-medium">Histórico</h2>
                    <button onClick={onClose}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                </div>
                <div className="mt-4">
                    {history.map((item, index) => (
                        <div key={index} className="mb-2 p-2 border rounded-md text-primary-dark">
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryCard;