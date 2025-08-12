import { twMerge } from "tailwind-merge";

function FormInput({ label, type, placeholder, className, onChange, value, disabled, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="text-lg font-medium text-gray-900 dark:text-white mb-2 block"> 
          {label}
        </label>
      )}
      <input
        value={props.value}
        type={type || "text"} 
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className={twMerge(
          "w-full px-3 py-3 border border-gray-300 dark:border-white rounded-md shadow-sm", 
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent", 
          "dark:bg-gray-800 dark:text-white dark:placeholder-white",
          type === "number" && "hide-number-controls",
          disabled && "opacity-60 bg-gray-100 dark:bg-gray-800 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

export default FormInput;