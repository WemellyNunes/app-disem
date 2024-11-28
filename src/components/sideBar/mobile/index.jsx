import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../modal/confirmation";

const MobileMenu = ({ isOpen, toggleMenu }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowModal(true); // Mostra o modal quando o usuário clica em "Sair"
  };

  const handleConfirmLogout = () => {
    setShowModal(false); // Esconde o modal
    navigate("/"); // Redireciona para a página de login
  };

  const handleCancelLogout = () => {
    setShowModal(false); // Apenas fecha o modal
  };

  return (
    <div className="md:hidden">
      {/* Cabeçalho fixado no topo */}
      <div className="w-full bg-white border-b fixed top-0 z-50">
        <button
          className="bg-white text-primary-dark px-4 py-2 rounded-md flex items-center gap-2"
          onClick={toggleMenu}
        >
          <span className="font-medium text-sm">MENU</span>
          <span className="text-sm">☰</span>
        </button>
      </div>

      {/* Menu deslizante */}
      {isOpen && (
        <div className="absolute top-10 left-0 w-full bg-white shadow-lg z-40">
          <ul className="flex flex-col">
            <li className="border-b">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-2 ${
                    isActive
                      ? "text-white bg-blue-700 hover:bg-blue-800"
                      : "text-primary-dark text-sm hover:bg-blue-50"
                  }`
                }
                onClick={toggleMenu}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="border-b">
              <NavLink
                to="/form"
                className={({ isActive }) =>
                  `block px-4 py-2 ${
                    isActive
                      ? "text-white bg-blue-700 hover:bg-blue-800"
                      : "text-primary-dark text-sm hover:bg-blue-50"
                  }`
                }
                onClick={toggleMenu}
              >
                Cadastrar
              </NavLink>
            </li>
            <li className="border-b">
              <NavLink
                to="/listing"
                className={({ isActive }) =>
                  `block px-4 py-2 ${
                    isActive
                      ? "text-white bg-blue-700 hover:bg-blue-800"
                      : "text-primary-dark text-sm hover:bg-blue-50"
                  }`
                }
                onClick={toggleMenu}
              >
                Listas
              </NavLink>
            </li>
            <li className="border-b">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `block px-4 py-2 ${
                    isActive
                      ? "text-white bg-blue-700 hover:bg-blue-800"
                      : "text-primary-dark text-sm hover:bg-blue-50"
                  }`
                }
                onClick={toggleMenu}
              >
                Usuários
              </NavLink>
            </li>
            <li className="border-b">
              {/* Botão para sair */}
              <button
                className="block w-full text-left px-4 py-2 text-primary-dark text-sm hover:bg-blue-50"
                onClick={handleLogoutClick}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Modal de confirmação */}
      {showModal && (
        <ConfirmationModal
          title="Confirmação de saída"
          message="Tem certeza que deseja sair?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </div>
  );
};

export default MobileMenu;
