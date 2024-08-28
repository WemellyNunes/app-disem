const ButtonTertiary = ({ children, ...props }) => {
   
    return (
      <button
        className=" bg-white hover:bg-secondary-hover text-primary-light font-medium text-base h-10 px-6 rounded-full flex items-center justify-center"
        {...props}
      >
        {children}
      </button>
    );
  };

export default ButtonTertiary;