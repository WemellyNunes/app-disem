const ButtonSecondary = ({ children, borderColor = 'border border-primary-light', bgColor = 'bg-white', hoverColor ='hover:bg-green-100', textColor = 'text-primary-light', icon, ...props }) => {
  return (
      <button
          className={`${borderColor} ${bgColor} ${hoverColor} ${textColor} 
          font-medium text-xs md:text-sm h-9 md:h-11 px-10 rounded-full flex items-center justify-center`}
          {...props}
      >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
      </button>
  );
};

export default ButtonSecondary;
