const ButtonTertiary = ({ children, bgColor = 'bg-white', textColor = 'text-primary-light', hoverColor ='hover:bg-secondary-hover', icon, ...props }) => {
  return (
      <button
          className={`${bgColor}  ${textColor} ${hoverColor} font-medium text-xs md:text-base h-10 px-8 rounded-full flex items-center justify-center mr-1.5`}
          {...props}
      >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
      </button>
  );
};

export default ButtonTertiary;
