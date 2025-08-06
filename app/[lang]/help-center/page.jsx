import notFound from "@/assets/notfound.png";
import Image from "next/image";

function HelpCenter() {
    return ( 
        <div className="container py-[40px] lg:py-[80px] text-center">
            <div>
                <iframe className="w-full h-[380px] lg:h-[500px]" src="https://www.youtube.com/embed/nrxUxr9c5CE?list=PLIAO2T5dSfa2JHTZSwXP7UmzeGoTLLCX8" title="How to Deposit &amp; Withdraw Crypto on Binance | #Binance Official Guide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                {/* <Image
                src={notFound}
                className="w-[300px] h-[300px] mx-auto opacity-50"
                />
                <h4 className="text-xl text-gray-700">There is currently no data available</h4> */}
            </div>
        </div>
     );
}

export default HelpCenter;