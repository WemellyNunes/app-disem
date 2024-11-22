import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const SearchInput = ({ placeholder, onSearch }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value); 
    };

    return (
        <div className={`flex items-center bg-white border border-gray-400 hover:border-primary-light  h-8 px-2 rounded-md transition-all duration-300 ease-in-out ${isExpanded ? 'w-full' : 'w-9'} md:w-1/4`}>
            <FaSearch
                className="text-primary-light cursor-pointer h-3 w-3"
                onClick={toggleExpand}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                className={` text-xs md:text-md font-light text-primary-dark w-full placeholder-primary-dark rounded-md px-2 focus:outline-none transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 block' : 'hidden'} md:block w-full' `}
            />
        </div>
    );
};

export default SearchInput;