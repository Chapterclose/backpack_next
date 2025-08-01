import { currenciesListArr } from "@/constant/assetsdata";
import Image from "next/image";
import Link from "next/link";
import { BiRightArrowAlt, BiRightArrowCircle } from "react-icons/bi";

function RechargeDepositPage() {
    return ( 
        <div className="container py-[80px]">
            <h4 className="text-4xl font-semibold text-black mb-8 text-center">Quick Coin Charging</h4>
            

            <div className="max-w-[560px] mx-auto">
                <h4 className="text-2xl font-semibold text-gray-900 mb-3">Currency List
                </h4>


                <ul>
                    {
                        currenciesListArr?.map((item,)=>(
                            <Link href={`/recharge-apply?coin=${item.title}`} className="flex items-center justify-between hover:bg-gray-100 px-3 rounded">
                                <div key={item.id} className="flex items-center gap-x-2 py-3">
                                    <Image width={25} height={25} src={item.img}/>
                                    <h4>{item.title}</h4>
                                </div>

                                <BiRightArrowAlt/>
                            </Link>
                        ))
                    }
                </ul>
            </div>

        </div>
     );
}

export default RechargeDepositPage;