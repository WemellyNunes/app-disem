import React from "react";

const PeriodSelect = ({ type, value, onChange, options }) => {
    return (
        <div className="flex flex-col">
            <select
                value={value}
                onChange={onChange}
                className="border px-2 h-7 rounded cursor-pointer text-sm text-gray-600"
            >
                <option value="">Selecione o {type}</option>
                {options.map((option) => (
                    <option key={option.value || option} value={option.value || option}>
                        {option.name || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PeriodSelect;
