"use client"

import { ArrowLeft } from "lucide-react";
import { twMerge } from "tailwind-merge";

function Heading({text, className}) {
    return ( 
        <h4 className={twMerge("text-2xl lg:text-4xl font-semibold dark:text-white text-black mb-8 text-center flex items-center lg:justify-center gap-x-1", className)}> <button onClick={()=>window.history.back()} className="lg:hidden"> <ArrowLeft className="pt-1 cursor-pointer"/> </button> {text}</h4>
     );
}

export default Heading;