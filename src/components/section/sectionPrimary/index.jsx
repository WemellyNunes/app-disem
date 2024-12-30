import { useState } from "react";
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";

const SectionCard = ({ title, children, background, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`px-4 bg-white md:px-6 py-4 border border-gray-300 rounded-xl mb-3 mt-1.5 md:mb-1.5 w-full`}>
      <div className="flex flex-col gap-y-1 mb-7">
        <h2
          className="text-gray-800 text-sm md:text-base font-medium cursor-pointer flex"
          onClick={toggleSection}
        >
          {title}
          {isOpen ? <IoIosRemoveCircleOutline className="ml-2 h-5 w-5 block md:hidden" /> : <IoIosAddCircleOutline className="ml-2 h-5 w-5 block md:hidden" />}
        </h2>
        <p className="text-sm text-primary-dark">{placeholder}</p>
      </div>

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
