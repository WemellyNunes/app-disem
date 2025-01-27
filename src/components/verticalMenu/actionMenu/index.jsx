import { useState } from 'react';
import { GoKebabHorizontal } from "react-icons/go";

const ActionsMenu = ({ onEdit, onDelete, onNegate, showNegate, showEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-gray-700 bg-gray-100 font-bold text-lg hover:text-blue-700 hover:bg-blue-100 p-1 rounded-full"
      >
        <GoKebabHorizontal />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 text-primary-dark">
          {/* Só exibe "Editar" se showEdit for verdadeiro */}
          {showEdit && (
            <button
              onClick={() => {
                onEdit();
                toggleMenu();
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
            >
              Editar
            </button>
          )}

          <button
            onClick={() => {
              onDelete();
              toggleMenu();
            }}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
          >
            Excluir
          </button>

          {/* Só exibe "Negar" se showNegate for verdadeiro */}
          {showNegate && (
            <button
              onClick={() => {
                onNegate();
                toggleMenu();
              }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
            >
              Negar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
