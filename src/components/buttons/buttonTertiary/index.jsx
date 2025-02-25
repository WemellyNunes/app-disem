const ButtonTertiary = ({ children, bgColor = 'bg-white', textColor = 'text-primary-light', hoverColor ='hover:bg-green-100', icon, ...props }) => {
  return (
      <button
          className={`${bgColor}  ${textColor} ${hoverColor} font-medium text-sm h-11 px-10  rounded-full flex items-center justify-center mr-1.5`}
          {...props}
      >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
      </button>
  );
};

export default ButtonTertiary;
