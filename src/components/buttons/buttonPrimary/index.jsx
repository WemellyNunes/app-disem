const ButtonPrimary = ({ children, bgColor = 'bg-primary-light', hoverColor = 'hover:bg-primary-hover', textColor = 'text-white', icon, ...props }) => {
  return (
      <button
          className={`${bgColor} ${hoverColor} ${textColor} 
          font-medium text-xs md:text-sm h-9 md:h-11 px-10 rounded-full flex items-center 
          justify-center mr-1.5`}
          {...props}
      >
          {icon && <span className="mr-2">{icon}</span>} 
          {children}
      </button>
  );
};

export default ButtonPrimary;
