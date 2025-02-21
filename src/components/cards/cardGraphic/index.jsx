
const Card = ({ children }) => {
  return (
    <div className="bg-white rounded-lg p-6 flex justify-center items-center w-full h-full md:h-96 shadow mt-2 mb-2 hover:border hover:border-primary-light">
      {children}
    </div>
  );
};

export default Card;