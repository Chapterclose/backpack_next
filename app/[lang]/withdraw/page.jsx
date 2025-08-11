import Heading from "@/components/common/Heading";
import { currenciesListArr } from "@/constant/assetsdata";
import Image from "next/image";
import Link from "next/link";
import { BiRightArrowAlt, BiRightArrowCircle } from "react-icons/bi";

function Withdraw() {
    return ( 
        <div className="container py-[80px]">
            <Heading text={"Withdrawal"} />
            

            <div className="max-w-[560px] mx-auto">
                <h4 className="text-2xl font-semibold dark:text-white text-gray-900 mb-3">Currency List
                </h4>


                <ul>
                    {
                        currenciesListArr?.map((item,)=>(
                            <Link key={item.id} href={`/en/withdraw-apply?coin=${item.title.toLocaleLowerCase()}`} className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 px-3 rounded">
                                <div key={item.id} className="flex items-center gap-x-2 py-3">
                                    <Image width={25} height={25} src={item.img} alt={item.id}/>
                                    <h4 className="dark:text-white">{item.title}</h4>
                                </div>

                                <BiRightArrowAlt className="dark:text-white"/>
                            </Link>
                        ))
                    }
                </ul>
            </div>

        </div>
     );
}

export default Withdraw;