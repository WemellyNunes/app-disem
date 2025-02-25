import { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isValid, parse, format, getYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import './index.css';

registerLocale('pt-BR', ptBR);

const DateTimePicker = ({ label, placeholder, onDateChange, className, disabled, value, errorMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState("");
  const datePickerRef = useRef(null);
  
  const minYear = 2024;
  const maxYear = new Date().getFullYear();

  useEffect(() => {
    if (value) {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
            const year = getYear(parsedDate);
            if (year >= minYear && year <= maxYear) {
                setInputValue(format(parsedDate, "dd/MM/yyyy"));
                setStartDate(parsedDate);
            }
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
    const year = getYear(date);
    if (year < minYear || year > maxYear) {
      setError(`Ano inválido. Escolha um ano entre ${minYear} e ${maxYear}.`);
      return;
    }
    
    const formattedDate = format(date, "dd/MM/yyyy");
    setInputValue(formattedDate);
    setStartDate(date);
    onDateChange && onDateChange(format(date, "yyyy-MM-dd"));
    setIsCalendarOpen(false);
    setError("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatInputDate(value);
    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        const year = getYear(parsedDate);
        if (year < minYear || year > maxYear) {
          setError(`Ano inválido. Escolha um ano entre ${minYear} e ${maxYear}.`);
          setInputValue("");
          return;
        }
        setStartDate(parsedDate);
        onDateChange && onDateChange(format(parsedDate, "yyyy-MM-dd"));
        setError("");
      }
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="relative mb-4" ref={datePickerRef}>
      <label className="block text-sm font-normal text-primary-dark mb-2">{label}</label>
      <div className={`flex items-center border border-gray-400 rounded h-11 pl-4 pr-1 ${disabled ? 'bg-gray-50 border-none' : ''} ${className}`}>
        <input
          type="text"
          placeholder={placeholder || "exemplo: 00/00/0000"}
          value={inputValue}
          onChange={handleInputChange}
          maxLength={10}
          className={`w-full border-none focus:outline-none placeholder-gray-400 text-xs md:text-sm italic ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
          disabled={disabled}
        />
        <FaCalendarAlt
          className={`hover:bg-secondary-hover cursor-pointer rounded ml-2 p-1 h-6 w-6 ${disabled ? 'text-gray-400' : 'text-primary-light'}`}
          onClick={() => !disabled && setIsCalendarOpen(!isCalendarOpen)}
        />
      </div>
      {isCalendarOpen && (
        <div className="absolute mt-2 z-50 bg-white shadow-lg rounded-md">
          <DatePicker
            selected={startDate}
            onChange={handleDateSelect}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            inline
            className="custom-calendar"
            minDate={new Date(minYear, 0, 1)} 
            maxDate={new Date(maxYear, 11, 31)} 
          />
        </div>
      )}
      {(error || errorMessage) && <span className="text-red-600 text-xs">{error || errorMessage}</span>}
    </div>
  );
};

export default DateTimePicker;
