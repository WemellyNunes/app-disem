import { useState } from 'react';

const ActionsMenu = ({ onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button onClick={toggleMenu} className="text-primary-light font-bold text-lg hover:text-blue-900">
                ⋮
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 text-primary-dark">
                    <button onClick={() => { onView(); toggleMenu(); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200">Visualizar</button>
                    <button onClick={() => { onEdit(); toggleMenu(); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200">Editar</button>
                    <button onClick={() => { onDelete(); toggleMenu(); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200">Excluir</button>
                </div>
            )}
        </div>
    );
};

export default ActionsMenu;