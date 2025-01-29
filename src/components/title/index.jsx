import { useNavigate } from 'react-router-dom';
import { RiArrowLeftSLine } from "react-icons/ri";
import ConfirmationModal from "../modal/confirmation";
import { RiLogoutCircleRLine, RiNotificationLine  } from "react-icons/ri";
import { useState } from 'react';

const PageTitle = ({ text, backgroundColor, children }) => {
  
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
    <div className={`w-full ${backgroundColor} text-gray-800 flex items-center justify-between px-2 md:px-6 h-8 md:h-10 border-b border-gray-30 mt-10 md:mt-0`}>

      <div className='flex flex-row gap-x-2'>
        <button 
          onClick={() => navigate(-1)} 
          className="flex flex-row items-center text-primary-dark p-1 rounded hover:bg-gray-200 focus:outline-none gap-x-1"
          aria-label="Voltar"
        >
          <RiArrowLeftSLine />
          <span className='text-sm' >Voltar</span>
        </button>
        <span className='flex flex-row items-center text-gray-300' >|</span>

        <div className='flex flex-row items-center'>
          <h1 className="text-sm md:text-base font-normal">{text}</h1>
          <div className="ml-auto">{children}</div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-2" onClick={handleLogoutClick}>
        <RiNotificationLine  className="text-gray-700 md:h-5 md:w-5 cursor-pointer hover:text-primary-light" title="Sair" /> 
        <RiLogoutCircleRLine className="text-gray-700 md:h-5 md:w-5 cursor-pointer hover:text-primary-light" title="Sair" /> 
      </div>
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
    </div>
    
  );
};

export default PageTitle;
