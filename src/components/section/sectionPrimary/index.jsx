import { useState } from "react";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";

const SectionCard = ({ title, children, background }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`px-4 bg-white md:px-6 py-4 border border-gray-300 rounded shadow-sm mb-0 mt-1.5 w-full`}>
      <h2
        className="text-primary-light text-sm font-medium mb-4 cursor-pointer flex items-center"
        onClick={toggleSection}
      >
        {title}
        {isOpen ? <IoIosRemoveCircleOutline className="ml-2 h-5 w-5 block md:hidden" /> : <IoIosAddCircleOutline className="ml-2 h-5 w-5 block md:hidden" />}
      </h2>

      <div
        className={`transition-all duration-300 ease-in-out md:block ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
