
const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-lg p-6 flex justify-center items-center w-full h-full md:h-96 border border-gray-300 mt-2 mb-2">
      {children}
    </div>
  );
};

export default Card;