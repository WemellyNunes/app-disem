import { useState } from "react";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";

const SectionCard = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" bg-white px-4 md:px-6 py-4 rounded shadow mb-0 mt-1.5 w-full">
      <h2
        className="text-primary-light text-sm md:text-base font-normal mb-4 cursor-pointer flex items-center"
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
