import { FaSpinner } from 'react-icons/fa';

const ButtonPrimary = ({ 
  children, 
  bgColor = 'bg-primary-light', 
  hoverColor = 'hover:bg-green-700', 
  textColor = 'text-white', 
  icon, 
  loading = false, 
  ...props 
}) => {
  return (
      <button
          className={`${bgColor} ${hoverColor} ${textColor} 
          font-medium text-xs md:text-sm h-9 md:h-11 px-10 rounded-full flex items-center 
          justify-center disabled:opacity-50`}
          disabled={loading || props.disabled}
          {...props}
      >
          {loading ? (
              <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Processando...
              </span>
          ) : (
              <>
                  {icon && <span className="mr-2">{icon}</span>}
                  {children}
              </>
          )}
      </button>
  );
};

export default ButtonPrimary;
