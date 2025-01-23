import { GiBackwardTime } from "react-icons/gi";
import { MdEditNote } from "react-icons/md";
import { GoNote } from "react-icons/go";



 // ícones para adicionar e visualizar relatos


const StatusBar = ({ requisitionNumber, origin, situation, reopening, onHistoryClick, onAddReportClick, onViewReportsClick, reportsCount }) => {

    

    return (
        <div className="flex justify-between items-center mx-2 md:mx-6 px-2 md:px-6 py-1 border border-gray-300 rounded-xl bg-white mt-4">
      <div className="flex space-x-2 md:space-x-6 px-2">
        <div>
          <h4 className="text-xs font-medium text-gray-800 md:text-sm">Requisição</h4>
          <p className="text-xs font-normal text-primary-dark">{requisitionNumber}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-800 md:text-sm">Origem</h4>
          <p className="text-xs font-normal text-primary-dark">{origin}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-800 md:text-sm">Situação</h4>
          <p className="text-xs font-normal text-primary-dark">{situation}</p>
        </div>
        <div>
          <h4 className="hidden md:flex text-xs font-medium text-gray-800 md:text-sm">Reabertura</h4>
          <p className="hidden md:flex text-xs font-normal text-primary-dark">{reopening}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {/* Botão para Adicionar Relato */}
        <button
          onClick={onAddReportClick}
          className="flex focus:outline-none items-center justify-center p-2 bg-gray-100 text-gray-700 hover:bg-blue-100 rounded-full " title="Acicionar relatos"
        >
          <span><MdEditNote className="w-4 h-4 " /></span>
        </button>

        {/* Botão para Ver Relatos */}
        <button
          onClick={onViewReportsClick}
          className="flex focus:outline-none items-center justify-center p-2 bg-gray-100 text-gray-700 hover:bg-blue-100 rounded-full  " title="Ver relatos"
        >
          <span><GoNote className="w-4 h-4" /></span>
          {reportsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              {reportsCount}
            </span>
          )}
        </button>

        {/* Botão de Histórico */}
        <button
          onClick={onHistoryClick}
          className="flex focus:outline-none items-center justify-center p-2 bg-gray-100 text-gray-700 hover:bg-blue-100 rounded-full " title="Histórico"
        >
          <span><GiBackwardTime className="w-4 h-4" /></span>
        </button>
      </div>
    </div>
  );
};


export default StatusBar;