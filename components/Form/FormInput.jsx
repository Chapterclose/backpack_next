import { twMerge } from "tailwind-merge";

function FormInput({label, type, placeholder,className, ...props}) {
    return ( 
        <div>
            {label !== "" && <label className="text-lg mb-2 block font-medium">{label}</label>}
            <input type={type ? type :"text"} placeholder={placeholder} className={twMerge("w-full h-10 rounded border border-gray-900 dark:border-white focus:outline-none pl-4 dark:placeholder:text-white", className)} />
        </div>
     );
}

export default FormInput;