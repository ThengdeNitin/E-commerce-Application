const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0 px-4">
      
      <div className="flex flex-col items-center text-center">
        <div className={`${step1 ? "text-green-500" : "text-gray-300"} font-semibold`}>
          Login
        </div>
        {step1 && <div className="mt-1 text-lg">✅</div>}
      </div>

      {step2 && (
        <div className={`hidden sm:block flex-1 h-0.5 bg-green-500`} />
      )}

      {step2 && (
        <div className="flex flex-col items-center text-center">
          <div className={`${step1 ? "text-green-500" : "text-gray-300"} font-semibold`}>
            Shipping
          </div>
          {step1 && step2 && <div className="mt-1 text-lg">✅</div>}
        </div>
      )}

      {step3 && (
        <div className={`hidden sm:block flex-1 h-0.5 bg-green-500`} />
      )}

      {step3 && (
        <div className="flex flex-col items-center text-center">
          <div className={`${step3 ? "text-green-500" : "text-gray-300"} font-semibold`}>
            Summary
          </div>
          {step1 && step2 && step3 && <div className="mt-1 text-lg">✅</div>}
        </div>
      )}
    </div>
  );
};

export default ProgressSteps;
