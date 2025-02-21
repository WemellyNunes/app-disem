const StatCard = ({ title, approved, finalized, borderColor, percentage, hover }) => {
    return (
      <div className={`p-4 w-full mb-2 rounded-md bg-white  ${borderColor} text-primary-dark shadow border-r-8  flex flex-col justify-between hover:border hover:border-primary-light hover:border-r-8`} >
        <div className="flex justify-between items-center mb-4">
          {percentage && (
            <div className="hidden md:flex bg-white text-blue-600 rounded-full h-11 w-11 items-center justify-center">
              <span className="text-base font-medium ">{percentage}%</span>
            </div>
          )}
          <h3 className="text-lg font-semibold w-40 md:w-11">{title}</h3>
        </div>
        <div className="flex flex-col">
          <p className="text-sm">Aprovadas <span className="float-right font-medium text-xl">{approved}</span></p>
          <p className="text-sm">Finalizadas <span className="float-right font-medium text-xl">{finalized}</span></p>
        </div>
      </div>
    );
  };
  
  export default StatCard;

  /*
  <div className="flex flex-col justify-between mx-4 mt-3 gap-x-2.5 sm:flex-row">
          <StatCard
            title="Sipac"
            approved={13}
            finalized={6}
            backgroundColor="bg-primary-light"
            percentage={65}

          />
  */