import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";
import { FaRegListAlt, FaBars, FaSignOutAlt, FaUsers } from "react-icons/fa"; 

const Sidebar = ({ isCollapsed, toggleSidebar }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); 
  };

  return (
    <div className={`flex flex-col h-1/2 md:h-full bg-white md:shadow  md:fixed ${isCollapsed ? 'w-12 md:w-14 ' : 'w-64'}  transform`} // Mantém altura completa da tela
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-start gap-x-4 text-primary-light mt-2">
            <button
              className="text-primary-light"
              onClick={toggleSidebar}
            >
              <FaBars className='h-4 md:h-5 w-4 md:w-5' />
            </button>
            <span className={`text-sm md:text-lg font-semibold text-primary-light ${isCollapsed ? 'hidden' : ''}`}>
              E.M Control
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
              `flex items-center text-primary-light gap-x-4 border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
            }>
            <MdOutlineDashboard className='h-4 md:h-5 w-4 md:w-5' />
            <span className={`${isCollapsed ? 'hidden' : ''}`}>Dashboard</span>
          </NavLink>

          <NavLink
            to="/form"
            className={({ isActive }) =>
              `flex items-center text-primary-light gap-x-4 border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
            }>
            <FaFilePen className='h-4 md:h-5 w-4 md:w-5' />
            <span className={`${isCollapsed ? 'hidden' : ''}`}>Cadastrar</span>
          </NavLink>

          <NavLink
            to="/listing"
            className={({ isActive }) =>
              `flex items-center text-primary-light gap-x-4 border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
            }>
            <FaRegListAlt className='h-4 md:h-5 w-4 md:w-5' />
            <span className={`${isCollapsed ? 'hidden' : ''}`}>Lista</span>
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center text-primary-light gap-x-4 border-b px-4 py-4 hover:bg-blue-200 ${isActive ? 'bg-blue-700 text-white hover:text-primary-light' : ''}`
            }>
            <FaUsers className='h-4 md:h-5 w-4 md:w-5' />
            <span className={`${isCollapsed ? 'hidden' : ''}`}>Usuários do sistema</span>
          </NavLink>
        </div>
      </div>

      <div className="flex items-center justify-center p-4  mt-auto cursor-pointer hover:bg-red-100" onClick={handleLogout}>
        <FaSignOutAlt className="text-red-600 h-4 md:h-5 w-4 md:w-5" />
        <span className={`text-red-500 font-medium ${isCollapsed ? 'hidden' : 'ml-2'}`}>Sair</span>
      </div>

    </div>
  );
};

export default Sidebar;
