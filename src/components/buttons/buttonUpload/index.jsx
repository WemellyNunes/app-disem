const ButtonUpload = ({ children, ...props }) => {
    return (
        <button
            className={`
            font-medium text-xs md:text-sm h-9 md:h-11 px-10 rounded-full flex items-center 
            justify-center border-2 border-dashed border-gray-500 text-gray-600 hover:bg-gray-200`}
            {...props}
        >
            {children}
        </button>
    );
  };
  
  export default ButtonUpload;