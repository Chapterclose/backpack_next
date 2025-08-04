
import { BadgeDollarSign, CloudDownload, CloudUpload, Eye, EyeOff, FolderSync, RefreshCw } from "lucide-react";
import Link from "next/link";

function AccountBalance({showBalance,toggleBalanceVisibility}) {
    return ( 
        <div>
            <div className="flex items-center gap-x-5">
                <h4 className="text-4xl font-semibold text-black">Account Balance(USDT)</h4>
                <div className="flex gap-x-2">
                    {showBalance ? (
                        <Eye onClick={toggleBalanceVisibility} className="cursor-pointer" />
                    ) : (
                        <EyeOff onClick={toggleBalanceVisibility} className="cursor-pointer" />
                    )}
                    <RefreshCw className="cursor-pointer" />
                </div>
            </div>
            <h3 className="text-3xl font-semibold text-black mt-2">
                {showBalance ? "0.00" : "****"}
            </h3>

            <div className="flex items-center text-center gap-x-5 mt-10">
                <Link href="/recharge-deposit" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer">
                    <CloudUpload className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="font-medium text-black mt-1">Deposit</h4>
                </Link>
                <Link href="/withdraw" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer">
                    <CloudDownload className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="font-medium text-black mt-1">Withdraw</h4>
                </Link>
                <Link href="/convert" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer">
                    <FolderSync className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="font-medium text-black mt-1">Convert</h4>
                </Link>
                <Link href="/transfer" className="w-[90px] h-[90px] flex items-center flex-col justify-center shadow-lg rounded cursor-pointer">
                    <BadgeDollarSign className="mx-auto bg-primary w-[40px] h-[40px] text-xl p-2 rounded-full"/>
                    <h4 className="font-medium text-black mt-1">Transfer</h4>
                </Link>
            </div>
        </div>
      );
}

export default AccountBalance;