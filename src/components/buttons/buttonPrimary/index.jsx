const ButtonPrimary = ({ children, bgColor = 'bg-primary-light', hoverColor = 'hover:bg-blue-700', textColor = 'text-white', icon, ...props }) => {
  return (
      <button
          className={`${bgColor} ${hoverColor} ${textColor} 
          font-medium text-xs md:text-sm h-9 md:h-11 px-10 rounded-full flex items-center 
          justify-center`}
          {...props}
      >
          {icon && <span className="">{icon}</span>} 
          {children}
      </button>
  );
};

export default ButtonPrimary;
