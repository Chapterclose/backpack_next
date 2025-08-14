"use client"
import { Eye } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function FormPassword({label, type, placeholder,className, onChange, value, disabled, ...props}) {
    const [isEye, setIsEye] = useState(false)
    return ( 
        <div>
            {label !== "" && <label className="text-lg mb-2 dark:text-white block font-medium">{label}</label>}
            <div className="relative">
                <input onChange={onChange} type={isEye ? "text" :"password"}
                disabled={disabled} placeholder={placeholder} value={value} className={twMerge(
          "w-full px-3 py-3 border border-gray-300 dark:border-white rounded-md shadow-sm", 
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent", 
           "dark:bg-gray-800 dark:text-white dark:placeholder-white", disabled && "opacity-60 bg-gray-100 dark:bg-gray-800 cursor-not-allowed",)} />
                <Eye onClick={()=>setIsEye(!isEye)} className={twMerge("absolute right-2 cursor-pointer top-1/2 translate-y-[-50%] dark:text-white", disabled && "cursor-not-allowed")}/>
            </div>
        </div>
     );
}

export default FormPassword;