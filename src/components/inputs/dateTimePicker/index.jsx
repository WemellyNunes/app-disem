import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isValid, parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import './index.css';

registerLocale('pt-BR', ptBR);

const DateTimePicker = ({ label, placeholder, onDateChange, className, disabled, value, errorMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Atualiza o estado inicial e sempre que o 'value' mudar
  useEffect(() => {
    if (value) {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
            setInputValue(format(parsedDate, "dd/MM/yyyy")); // Atualiza o input para exibição
            setStartDate(parsedDate); // Sincroniza com o DatePicker
        }
    }
  }, [value]);

  const formatInputDate = (value) => {
    let cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length >= 2) cleanValue = cleanValue.slice(0, 2) + "/" + cleanValue.slice(2);
    if (cleanValue.length >= 5) cleanValue = cleanValue.slice(0, 5) + "/" + cleanValue.slice(5, 9);

    return cleanValue;
  };

  const handleDateSelect = (date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    setInputValue(formattedDate);
    setStartDate(date);
    onDateChange && onDateChange(format(date, "yyyy-MM-dd")); // Envia no formato yyyy-MM-dd
    setIsCalendarOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatInputDate(value);
    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setStartDate(parsedDate);
        onDateChange && onDateChange(format(parsedDate, "yyyy-MM-dd")); // Envia no formato yyyy-MM-dd
      }
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-xs md:text-sm font-normal text-primary-dark mb-2">{label}</label>
      <div className={`flex items-center border border-gray-400 rounded h-9 md:h-10 pl-4 pr-1 ${disabled ? 'bg-gray-50 border-none' : ''} ${className}`}>
        <input
          type="text"
          placeholder={placeholder || "exemplo: 00/00/0000"}
          value={inputValue}
          onChange={handleInputChange}
          maxLength={10}
          className={`w-full border-none focus:outline-none placeholder-gray-400 text-xs md:text-sm italic ${disabled ? 'text-gray-400' : 'text-gray-400'}`}
          disabled={disabled}
        />
        <FaCalendarAlt
          className={`hover:bg-secondary-hover cursor-pointer rounded ml-2 p-1 h-6 w-6 ${disabled ? 'text-gray-400' : 'text-primary-light'}`}
          onClick={() => !disabled && setIsCalendarOpen(!isCalendarOpen)}
        />
      </div>
      {isCalendarOpen && (
        <DatePicker
          selected={startDate}
          onChange={handleDateSelect}
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
          inline
          className="absolute mt-2 z-50 bg-white shadow-lg rounded-md"
          calendarClassName="custom-calendar"
        />
      )}
      {errorMessage && <span className="text-red-600 text-xs">{errorMessage}</span>}
    </div>
  );
};

export default DateTimePicker;
