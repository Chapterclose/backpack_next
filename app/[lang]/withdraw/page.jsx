import Heading from "@/components/common/Heading";
import { marketDataAssets } from "@/constant/marketArr";
import Image from "next/image";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

function Withdraw() {
  return (
    <div className="container py-[80px]">
      <Heading text={"Withdrawal"} />

      <div className="max-w-[560px] mx-auto">
        <h4 className="text-2xl font-semibold dark:text-white text-gray-900 mb-3">Currency List</h4>

        <ul>
          {marketDataAssets?.slice(0, 10).map((item) => (
            <Link
              prefetch
              key={item?.id}
              href={`/en/withdraw-apply?coin=${item.name.toLocaleLowerCase()}`}
              className="flex items-center justify-between px-3 rounded bg-gray-800 mb-2"
            >
              <div key={item?.id} className="flex items-center gap-x-2 py-3">
                <Image width={25} height={25} src={item?.icon} alt={item?.name} />
                <div>
                  <h4 className="dark:text-white">{item?.name} Wallet</h4>
                  <h4 className="dark:text-gray-400 text-xs">{item?.subname} Coin</h4>
                </div>
              </div>

              <BiRightArrowAlt className="dark:text-white" />
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Withdraw;
