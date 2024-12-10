import { GiBackwardTime } from "react-icons/gi";
import { AiOutlinePlus, AiOutlineFileText } from "react-icons/ai";
import { TbCalendarTime } from "react-icons/tb";
 // ícones para adicionar e visualizar relatos


const StatusBar = ({ requisitionNumber, origin, situation, reopening, onHistoryClick, onAddReportClick, onViewReportsClick, reportsCount }) => {

    

    return (
        <div className="flex justify-between items-center px-2 md:px-6 py-1 border-b bg-white ">
      <div className="flex space-x-2 md:space-x-6 px-2">
        <div>
          <h4 className="text-xs font-medium text-primary-light md:text-sm">Requisição</h4>
          <p className="text-xs font-normal text-primary-dark">{requisitionNumber}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-primary-light md:text-sm">Origem</h4>
          <p className="text-xs font-normal text-primary-dark">{origin}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-primary-light md:text-sm">Situação</h4>
          <p className="text-xs font-normal text-primary-dark">{situation}</p>
        </div>
        <div>
          <h4 className="hidden md:flex text-xs font-medium text-primary-light md:text-sm">Reabertura</h4>
          <p className="hidden md:flex text-xs font-normal text-primary-dark">{reopening}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {/* Botão para Adicionar Relato */}
        <button
          onClick={onAddReportClick}
          className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-green-500 hover:bg-green-700 text-white rounded-full focus:outline-none" title="Adicionar relato"
        >
          <span><AiOutlinePlus className="h-4 w-4" /></span>
        </button>

        {/* Botão para Ver Relatos */}
        <button
          onClick={onViewReportsClick}
          className="flex  items-center justify-center w-5 h-5 md:w-6 md:h-6  bg-blue-500 hover:bg-blue-700 text-white rounded-full focus:outline-none relative " title="Ver relatos"
        >
          <span><AiOutlineFileText className="h-4 w-4" /></span>
          {reportsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {reportsCount}
            </span>
          )}
        </button>

        {/* Botão de Histórico */}
        <button
          onClick={onHistoryClick}
          className="md:flex hidden items-center justify-center w-4 h-4 md:w-6 md:h-6  bg-orange-400 hover:bg-orange-700 text-white rounded-full focus:outline-none" title="Histórico"
        >
          <span><GiBackwardTime className="h-4 w-4" /></span>
        </button>
      </div>
    </div>
  );
};


export default StatusBar;