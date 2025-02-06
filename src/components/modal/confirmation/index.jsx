import ButtonPrimary from "../../buttons/buttonPrimary";
import ButtonSecondary from "../../buttons/buttonSecondary";
import { CiCircleAlert } from "react-icons/ci";


const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center text-center bg-gray-500 bg-opacity-40 z-50">
            <div className="flex flex-col justify-center bg-white p-6 rounded-lg shadow-lg w-full md:w-1/4 mx-1 md:mx-0">
                <div className="flex justify-center text-orange-300 mb-4">
                    <CiCircleAlert size={70} />
                </div>
                <h2 className="text-lg text-primary-dark font-medium mb-3">{title}</h2>
                <p className="mb-6 text-base text-primary-dark ">{message}</p>
                <div className="flex flex-wrap gap-y-2 md:gap-x-2 justify-center">
                    <ButtonSecondary onClick={onCancel}>
                        Cancelar
                    </ButtonSecondary>
                    <ButtonPrimary onClick={onConfirm}>
                        Sim
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;