import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";
import { FaRegListAlt, FaBars, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { useState } from "react";
import ConfirmationModal from "../modal/confirmation";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {

  const [showModal, setShowModal] = useState(false); // Controla a exibição do modal
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

    <>
      <div className={`flex flex-col h-1/2 md:h-full bg-white md:shadow md:fixed transition-all duration-300 ${isCollapsed ? 'w-12 md:w-14' : 'w-60'} transform`}>
        <div className="flex flex-col p-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-start  text-primary-light mt-2">
              <button
                className="text-primary-light"
                onClick={toggleSidebar}
              >
                <FaBars className='h-4 md:h-5 w-4 md:w-5' />
              </button>
              <span className={`transition-all duration-300 ease-in-out transform text-sm md:text-lg font-semibold text-primary-light ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'}`}>
                DISEM
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2">
          {/* Menu Options */}
          <div className="flex flex-col">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center text-primary-light border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
              }>
              <MdOutlineDashboard className='h-5 w-5' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Dashboard
              </span>
            </NavLink>

            <NavLink
              to="/form"
              className={({ isActive }) =>
                `flex items-center text-primary-light border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
              }>
              <FaFilePen className='h-5 w-5' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Cadastrar
              </span>
            </NavLink>

            <NavLink
              to="/listing"
              className={({ isActive }) =>
                `flex items-center text-primary-light border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
              }>
              <FaRegListAlt className='h-5 w-5' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Lista
              </span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center text-primary-light border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
              }>
              <FaUsers className='h-5 w-5' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Usuários
              </span>
            </NavLink>
          </div>

        </div>

        <div className="flex items-center justify-center p-4 mt-auto cursor-pointer hover:bg-red-100" onClick={handleLogoutClick}>
    <FaSignOutAlt className="text-red-600 h-5 w-5" /> {/* Ícone com tamanho fixo */}
    <span
      className={`text-red-500 font-medium transition-all duration-300 ease-in-out transform ${
        isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto ml-2'
      }`}
    >
      Sair
    </span>
  </div>

      </div>
      {/* Modal de confirmação */}
      {
        showModal && (
          <ConfirmationModal
            title="Confirmação de saida"
            message="Tem certeza que deseja sair?"
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )
      }
    </>


  );
};

export default Sidebar;
