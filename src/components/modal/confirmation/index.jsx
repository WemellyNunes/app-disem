import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import { CiCircleAlert } from "react-icons/ci";


const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="flex flex-col justify-center bg-white p-6 rounded-lg shadow-lg w-1/4 ">
                <div className="flex justify-center text-orange-300 mb-4">
                    <CiCircleAlert size={70} />
                </div>
                <h2 className="text-lg text-primary-dark font-medium mb-3">{title}</h2>
                <p className="mb-6 text-base text-primary-dark ">{message}</p>
                <div className="flex justify-center">
                    <ButtonSecondary onClick={onCancel}>
                        Cancelar
                    </ButtonSecondary>
                    <ButtonPrimary onClick={onConfirm}>
                        Confirmar
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;