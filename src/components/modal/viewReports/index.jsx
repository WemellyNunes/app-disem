import { useState } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import { FaTimes } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ViewReports = ({ reports, onClose }) => {
    const [openReportIndex, setOpenReportIndex] = useState(null);

    const toggleReport = (index) => {
        if (openReportIndex === index) {
            setOpenReportIndex(null);
        } else {
            setOpenReportIndex(index);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 mx-2 md:mx-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm md:text-base text-primary-light font-medium">Relatos</h2>
                    <button onClick={onClose}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                </div>
                <p className="mb-4 text-sm text-gray-500">Item: {reports.length}</p>
                {/* Contêiner para relatos com rolagem */}
                <div
                    className={`mb-6 ${
                        reports.length > 10 ? 'h-96 overflow-y-auto' : ''
                    }`}
                >
                    {reports.slice().reverse().map((report, index) => (
                        <div key={index}>
                            <div
                                className="flex cursor-pointer border-b py-2"
                                onClick={() => toggleReport(index)}
                            >
                                <div className="flex items-center justify-between w-full text-primary-dark hover:text-primary-light">
                                    <div className="flex">
                                        <span className="font-medium">
                                            {report.usuario}
                                            <span>&nbsp;</span>
                                        </span>
                                        <span>
                                            adicionou um relato. {report.data}
                                        </span>
                                    </div>
                                    <div className="">
                                        <span>
                                            {openReportIndex === index ? (
                                                <FaChevronUp />
                                            ) : (
                                                <FaChevronDown />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {openReportIndex === index && (
                                <div className="bg-gray-50 border text-sm text-primary-dark p-3 rounded">
                                    {report.texto}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <ButtonPrimary onClick={onClose}>Fechar</ButtonPrimary>
                </div>
            </div>
        </div>
    );
};

export default ViewReports;
