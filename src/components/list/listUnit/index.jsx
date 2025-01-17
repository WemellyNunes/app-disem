import { FaEdit, FaTrash } from "react-icons/fa";

const ListUnit = ({ filteredData, handleEditClick, handleDeleteClick }) => {
    return (
        <div>
            <div>
                <p className="flex text-sm text-primary-dark mb-2">Total de unidades: {filteredData.length}</p>
            </div>
            <div className="flex text-sm font-medium text-primary-dark md:justify-none justify-between  px-3 border-b border-gray-300 py-2 mt-4">
                <p className='flex flex-col md:w-1/2'>Unidade</p>
                <p className='flex flex-col md:w-1/2'>Campus</p>
                <p>Ações</p>
            </div>

            <div className="flex flex-col">
                {filteredData.length > 0 ? (
                    filteredData.map((unit) => (
                        <div
                            key={unit.id}
                            className="flex flex-col md:flex-row px-2 py-3.5 text-primary-dark text-sm bg-white border-b border-gray-300 hover:bg-blue-50 uppercase"
                        >
                            <div className="flex flex-col md:w-1/2">
                                <span>{unit.unit}</span>
                            </div>
                            <div className="flex flex-col md:w-1/2">
                                <span>{unit.campus}</span>
                            </div>
                            <div className="flex items-center space-x-2 justify-end">
                                <button
                                    onClick={() => handleEditClick(unit)} // Corrigido para `unit`
                                    className="text-primary-light hover:text-blue-500"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(unit)} // Corrigido para `unit`
                                    className="text-primary-light hover:text-blue-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-primary-dark py-4">
                        Nenhum registro encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListUnit;
