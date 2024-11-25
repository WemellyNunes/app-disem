import { useState } from 'react';
import ButtonPrimary from '../../buttons/buttonPrimary';
import ButtonSecondary from '../../buttons/buttonSecondary';
import { FaTimes } from 'react-icons/fa';

const AddReport = ({ onAdd, onCancel }) => {
    const [report, setReport] = useState('');

    const handleAdd = () => {
        if (report.trim()) {
            onAdd(report);
            setReport('');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 mx-1 md:mx-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm md:text-base text-primary-light font-medium">Relato</h2>
                    <button onClick={onCancel}>
                        <FaTimes className="text-gray-500 hover:text-red-500" />
                    </button>
                </div>

                <textarea
                    placeholder="Escreva um relato"
                    className="w-full border border-gray-300 rounded p-2 mb-4"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                />

                <div className="flex justify-end">
                    <ButtonSecondary onClick={onCancel}>
                        Cancelar
                    </ButtonSecondary>
                    <ButtonPrimary onClick={handleAdd}>
                        Adicionar
                    </ButtonPrimary>

                </div>
            </div>
        </div>
    );
};

export default AddReport;
