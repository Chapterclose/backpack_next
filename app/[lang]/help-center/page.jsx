import notFound from "@/assets/notfound.png"
import Image from "next/image";

function HelpCenter() {
    return ( 
        <div className="container py-[80px] text-center">
            <div>
                <Image
                src={notFound}
                className="w-[300px] h-[300px] mx-auto opacity-50"
                />
                <h4 className="text-xl text-gray-700">There is currently no data available</h4>
            </div>
        </div>
     );
}

export default HelpCenter;