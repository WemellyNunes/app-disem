import { IoMdClose } from "react-icons/io";

const Tag = ({ label, onRemove }) => {
    const handleRemove = () => {
        const confirmed = window.confirm(`Você tem certeza que deseja remover o filtro "${label}"?`);
        if (confirmed) {
            onRemove();
        }
    };

    return (
        <div className="flex items-center mr-0 md:mr-1 mx-2 md:mx-0 mt-1.5 bg-blue-100 text-primary-light text-xs md:text-sm px-2 gap-x-2 py-1 rounded border border-primary-light">
            {label}
            <button onClick={handleRemove}>
                <IoMdClose className="text-primary-light hover:text-red-500" />
            </button>
        </div>
    );
};

export default Tag;
