import { useState } from "react";

const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  showPasswordToggle = false,
  className = "",
  ...props
}) => {
  const [show, setShow] = useState(false);
  const inputType = showPasswordToggle ? (show ? "text" : "password") : type;

  const inputClasses = "font-inter text-sm shadow-[inset_0px_1px_1] w-full px-3 py-2 text-neutral-400 bg-neutral-100 rounded-lg outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-0 focus-visible:ring-0 placeholder-gray-500 border border-neutral-200/70";
  const labelClasses = "block text-gray-500 mb-1 text-sm font-medium font-inter";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`${inputClasses} ${showPasswordToggle ? "pr-20" : ""} ${className}`}
          required={required}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-400 hover:text-neutral-500 transition-colors outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-0"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;

