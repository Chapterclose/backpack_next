import Image from "next/image";
import img from "@/assets/markets/1.png"

function AssetDetails() {
    return ( 
        <div className="pt-[50px]">
            <h4 className="text-2xl text-black font-medium mb-3">Asset Details</h4>

            <div>
                <div className="flex items-center gap-x-3 mb-2">
                    <Image
                    src={img}
                    alt="coin"
                    height={30}
                    width={30}
                    />
                    <h4 className="text-lg font-medium">USDT</h4>
                </div>
                <div className="grid grid-cols-3">
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                </div>
            </div>
            <div className="my-5 border-t border-b border-primary-100 py-5">
                <div className="flex items-center gap-x-3 mb-2">
                    <Image
                    src={img}
                    alt="coin"
                    height={30}
                    width={30}
                    />
                    <h4 className="text-lg font-medium">BTC</h4>
                </div>
                <div className="grid grid-cols-3">
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center gap-x-3 mb-2">
                    <Image
                    src={img}
                    alt="coin"
                    height={30}
                    width={30}
                    />
                    <h4 className="text-lg font-medium">ETH</h4>
                </div>
                <div className="grid grid-cols-3">
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                    <div>
                        <h4 className="text-black">Available</h4>
                        <h4 className="font-medium">0.0000</h4>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default AssetDetails;