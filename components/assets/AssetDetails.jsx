import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdtImg from "@/assets/markets/usdt.png";
import UserStore from "@/store/UserStore";
import Image from "next/image";

function AssetDetails({ showBalance }) {
  const { AccountBalance } = UserStore();
  console.log(AccountBalance)
  return (
    <div className="pt-[50px]">
      <h4 className="text-2xl text-black dark:text-white font-medium mb-3">Asset Details</h4>

      <div>
        <div className="flex items-center gap-x-3 mb-2">
          <Image src={usdtImg} alt="coin" height={30} width={30} />
          <h4 className="text-lg font-medium">USDT</h4>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <h4 className="text-black dark:text-white">Available</h4>
            <h4 className="font-medium">{showBalance ? AccountBalance?.USDT?.available : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Occupation</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Equivalent(USDT)</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
        </div>
      </div>
      <div className="my-5 border-t border-b border-primary-100 py-5">
        <div className="flex items-center gap-x-3 mb-2">
          <Image src={btcImg} alt="coin" height={30} width={30} />
          <h4 className="text-lg font-medium">BTC</h4>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <h4 className="text-black dark:text-white">Available</h4>
            <h4 className="font-medium">{showBalance ? AccountBalance?.BTC?.available : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Occupation</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Equivalent(USDT)</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-x-3 mb-2">
          <Image src={ethImg} alt="coin" height={30} width={30} />
          <h4 className="text-lg font-medium">ETH</h4>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <h4 className="text-black dark:text-white">Available</h4>
            <h4 className="font-medium">{showBalance ? AccountBalance?.ETH?.available : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Occupation</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Equivalent(USDT)</h4>
            <h4 className="font-medium">{showBalance ? "0.00" : "****"}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetails;
