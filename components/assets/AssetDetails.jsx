import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdtImg from "@/assets/markets/usdt.png";
import { AmountWithCommas } from "@/lib/utils";
import UserStore from "@/store/UserStore";
import Image from "next/image";

function AssetDetails({ showBalance }) {
  const { AccountBalance } = UserStore();
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
            <h4 className="font-medium">
              {showBalance
                ? AccountBalance?.USDT?.available
                  ? AmountWithCommas(AccountBalance?.USDT?.available, "usd")
                  : "0"
                : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Locked</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.USDT?.locked, "usd") : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Total</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.USDT?.total, "usd") : "****"}
            </h4>
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
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.BTC?.available, "btc") : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Locked</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.BTC?.locked, "btc") : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Total</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.BTC?.total, "btc") : "****"}
            </h4>
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
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.ETH?.available, "eth") : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Locked</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.ETH?.locked, "eth") : "****"}
            </h4>
          </div>
          <div>
            <h4 className="text-black dark:text-white">Total</h4>
            <h4 className="font-medium">
              {showBalance ? AmountWithCommas(AccountBalance?.ETH?.total, "eth") : "****"}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssetDetails;
