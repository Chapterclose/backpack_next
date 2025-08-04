import { twMerge } from "tailwind-merge";

function FormInput({ label, type, placeholder, className, disabled, ...props }) {
  return (
    <div>
      {label !== "" && <label className="text-lg mb-2 block font-medium">{label}</label>}
      <input
        value={props.value}
        type={type ? type : "text"}
        placeholder={placeholder}
        className={twMerge(
          "w-full h-14 rounded border border-gray-900 dark:border-white focus:outline-none pl-4 dark:placeholder:text-white",
          type === "number" && "hide-number-controls",
          disabled && "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800", // Styling for disabled state
          className
        )}
        disabled={disabled} // Add the disabled attribute
        {...props}
      />
    </div>
  );
}

export default FormInput;