
const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex justify-center items-center w-full h-full md:h-96 border border-gary-300 mt-1.5">
      {children}
    </div>
  );
};

export default Card;