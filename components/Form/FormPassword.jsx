"use client"
import { Eye } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function FormPassword({label, type, placeholder,className, ...props}) {
    const [isEye, setIsEye] = useState(false)
    return ( 
        <div>
            {label !== "" && <label className="text-lg mb-2 dark:text-white block font-medium">{label}</label>}
            <div className="relative">
                <input type={isEye ? "text" :"password"} placeholder={placeholder} className={twMerge(
          "w-full px-3 py-3 border border-gray-300 dark:border-white rounded-md shadow-sm", 
          "focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent", 
          "dark:bg-gray-800 dark:text-white dark:placeholder-white")} />
                <Eye onClick={()=>setIsEye(!isEye)} className="absolute right-2 cursor-pointer top-1/2 translate-y-[-50%]"/>
            </div>
        </div>
     );
}

export default FormPassword;