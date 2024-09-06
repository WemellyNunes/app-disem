const SectionSecondary = ({ title, children }) => {
    return (
      <div className="bg-white px-4 md:px-6 py-4 rounded-md shadow-md mb-0 mt-1.5 w-full">
        <h2 className="text-primary-light text-sm md:text-lg font-medium mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {children}
        </div>
      </div>
    );
  };
  
  export default SectionSecondary;