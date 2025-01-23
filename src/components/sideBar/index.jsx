import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";
import { FaRegListAlt, FaBars, FaUsers, FaTools, FaSolarPanel   } from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";

import { useState } from "react";
import ConfirmationModal from "../modal/confirmation";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {

  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowModal(true); 
  };

  const handleConfirmLogout = () => {
    setShowModal(false); 
    navigate("/"); 
  };

  const handleCancelLogout = () => {
    setShowModal(false); 
  };

  return (
    <>
      <div className={`hidden md:flex flex-col h-1/2 md:h-full bg-gray-600 border-r border-gray-300 md:fixed transition-all duration-300 ${isCollapsed ? 'w-12 md:w-14' : 'w-60'} transform`}>
        <div className="flex flex-col p-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-start  text-primary-dark mt-2">
              <button
                className="text-white"
                onClick={toggleSidebar}
              >
                <FaBars className='h-4 w-4' />
              </button>
              <span className={`transition-all duration-300 ease-in-out transform text-sm md:text-base font-semibold text-white ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'}`}>
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
                `flex items-center border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <MdOutlineDashboard className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Dashboard
              </span>
            </NavLink>

            <span className={`text-xs text-gray-300  font-medium mt-6 mb-2 px-2 ${isCollapsed? 'opacity-0 translate-x-[-10px] hidden': ''} `}>SERVIÇO</span>

            <NavLink
              to="/form"
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <FaFilePen className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Cadastrar
              </span>
            </NavLink>

            <NavLink
              to="/listing"
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <FaRegListAlt className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Filas
              </span>
            </NavLink>

            <span className={`text-xs text-gray-300  font-medium mt-6 mb-2 px-2 ${isCollapsed? 'opacity-0 translate-x-[-10px] hidden' : 'opacity-100 translate-x-0 w-auto'} `}>PESSOAS</span>

            <NavLink
              to="/team"
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <FaTools className='h-4 w-3.5' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Equipe
              </span>
            </NavLink>


            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <FaUsers className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Usuários
              </span>
            </NavLink>


            <span className={`text-xs text-gray-300  font-medium mt-6 mb-2 px-2 ${isCollapsed? 'opacity-0 translate-x-[-10px] hidden' : 'opacity-100 translate-x-0 w-auto'} `}>MATERIAL</span>

            <NavLink
              to="/503"
              onClick={(e) => e.preventDefault()} 
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 cursor-not-allowed ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <BsCart4 className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Almoxerifado
              </span>
            </NavLink>


            <NavLink
              to="/503"
              onClick={(e) => e.preventDefault()} 
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 cursor-not-allowed ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <FaSolarPanel className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Equipamentos
              </span>
            </NavLink>
            
            <span className={`text-xs text-gray-300  font-medium mt-6 mb-2 px-2 ${isCollapsed? 'opacity-0 translate-x-[-10px] hidden' : 'opacity-100 translate-x-0 w-auto'} `}>INFRAESTRUTURA</span>

            <NavLink
              to="/infraestrutura"
              className={({ isActive }) =>
                `flex items-center text-primary-dark border-b border-gray-500 px-4 py-4 hover:bg-gray-300 hover:text-gray-700 ${isActive ? 'bg-white text-gray-700 hover:text-primary-dark' : 'text-white'}`
              }>
              <ImOffice className='h-4 w-4' /> {/* Ícone com tamanho fixo */}
              <span
                className={`transition-all duration-300 ease-in-out text-sm transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto pl-4'
                  }`}
              >
                Unidades/institutos 
              </span>
            </NavLink>

            
          </div>

        </div>

        <div className="flex items-center justify-center p-4 mt-auto cursor-pointer text-white hover:bg-gray-300 hover:text-gray-700" onClick={handleLogoutClick}>
          <RiLogoutCircleRLine className="h-5 w-5" /> {/* Ícone com tamanho fixo */}
          <span
            className={`font-medium transition-all duration-300 ease-in-out transform ${isCollapsed ? 'opacity-0 translate-x-[-10px] text-sm w-0 overflow-hidden' : 'opacity-100 translate-x-0 w-auto ml-2'
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
