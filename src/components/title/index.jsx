import { useNavigate } from 'react-router-dom';
import { RiArrowLeftSLine } from "react-icons/ri";



const PageTitle = ({ icon: Icon, text, backgroundColor, textColor, children }) => {
  const navigate = useNavigate();

  return (
    <div className={`w-full ${backgroundColor} ${textColor} flex items-center px-2 md:px-6 h-8 md:h-10 border-b border-gray-30 mt-10 md:mt-0 gap-x-2`}>
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
        <Icon className="h-4 w-4 mr-2" />
        <h1 className="text-sm md:text-base font-normal">{text}</h1>
        <div className="ml-auto">{children}</div>
      </div>
    </div>
  );
};

export default PageTitle;
