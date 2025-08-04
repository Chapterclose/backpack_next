"use client"
import { Eye } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function FormPassword({label, type, placeholder,className, ...props}) {
    const [isEye, setIsEye] = useState(false)
    return ( 
        <div>
            {label !== "" && <label className="text-lg mb-2 block font-medium">{label}</label>}
            <div className="relative">
                <input type={isEye ? "text" :"password"} placeholder={placeholder} className={twMerge("w-full h-14 rounded border border-gray-900 dark:border-white focus:outline-none pl-4 dark:placeholder:text-white", className)} />
                <Eye onClick={()=>setIsEye(!isEye)} className="absolute right-2 cursor-pointer top-1/2 translate-y-[-50%]"/>
            </div>
        </div>
     );
}

export default FormPassword;