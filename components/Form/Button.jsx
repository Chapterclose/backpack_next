import { twMerge } from "tailwind-merge";

function Button({text, variant, className, handleFunc}) {
    return ( 
        <button className={twMerge("bg-primary hover:bg-primary-100 duration-300 p-[10px_40px] dark:text-gray-900 rounded font-semibold cursor-pointer text-center", className)}
        onClick={handleFunc}
        >
            {text}
        </button>
     );
}

export default Button;