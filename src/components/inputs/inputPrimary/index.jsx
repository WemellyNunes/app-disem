import { forwardRef } from "react"; 

const InputPrimary = forwardRef(({ label, placeholder, value, onChange, className, disabled }, ref) => {
  return (
    <div className="w-full flex flex-col mb-4">
      <label className="block text-xs md:text-sm text-primary-dark font-normal mb-1" htmlFor="inputField">
        {label}
      </label>
      <input
        className={`block appearance-none w-full text-primary-dark border border-gray-300 
          rounded px-4 h-9 md:h-10 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 my-1 text-xs md:text-sm italic ${disabled ? 'bg-gray-100 border-none text-gray-400' : 'bg-white'} ${className}`}  
        id="inputField"
        type="text"
        placeholder={placeholder}
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        ref={ref}
        disabled={disabled}
      />
    </div>
  );
});

export default InputPrimary;