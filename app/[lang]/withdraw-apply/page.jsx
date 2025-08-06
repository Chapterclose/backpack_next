"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { ArrowLeft, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import usdtImg from "@/assets/markets/usdt.png";
import ethImg from "@/assets/markets/2.png";
import btcImg from "@/assets/markets/1.png";
import FormPassword from "@/components/Form/FormPassword";
import { useSearchParams } from "next/navigation";
function WithdrawApply() {
    const searchParams = useSearchParams()
    const coin = searchParams.get("coin")
    const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    // You can show a preview or handle upload here
  };
    return ( 
        <div className="container py-[60px]">
            <div className="flex items-center justify-between mb-5">
                <h4 className="text-xl lg:text-3xl font-semibold dark:text-white text-black mb-4 flex gap-x-3">
                    <button onClick={()=>window.history.back()}> <ArrowLeft className="pt-1 cursor-pointer"/> </button>
                    Withdrawal <span className="uppercase">{coin}</span></h4>

                <Link href="/withdraw-order" className="flex items-center gap-x-1 lg:text-xl font-semibold border border-primary-100 p-[2px_10px] lg:p-[5px_15px] rounded hover:border-primary-200 duration-300 mt-[-10px] lg:mt0 dark:text-white">History <BookMarked className="mt-1"/></Link>
            </div>


            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg py-5 px-2 lg:p-5">
                <div className="border-b pb-10 mb-10 border-gray-200 dark:border-gray-700 text-center">
                    <h4 className="text-6xl mb-2 dark:text-white text-black font-semibold">0.00</h4>
                    <p className="text-black dark:text-white font-medium">Available Balance(<span className="uppercase">{coin}</span>)</p>
                </div>


                <div className="mb-4">
                    <label className="text-lg mb-2 block dark:text-white font-medium">Withdrawal currency ({coin})</label>
                    <div className={"w-full h-13 rounded pl-4 bg-gray-100 dark:bg-gray-800 flex items-center gap-x-4 font-semibold"}>
                        <Image src={coin === "usd" && usdtImg || coin === "btc" && btcImg || coin === "eth" && ethImg } width={25} height={25} /> <h4 className="uppercase dark:text-white">{coin}</h4>
                    </div>
                </div>

                <div className="relative">
                    <FormInput
                    label="Withdrawal Amount"
                    placeholder="Please enter"
                    className="mb-5"
                    type="number"
                    />
                    <span className="absolute right-3 text-lg bottom-[30px] text-primary-200 font-semibold">Max</span>
                </div>

                <FormInput
                    label="Withdrawal address"
                    placeholder="Please enter"
                    className="mb-5"
                    value="0x583d2f75847f2916591c32c4f8bcc477c89ae5f4"
                    />
                
                <FormPassword
                label="Withdrawal Password"
                />


                <p className="my-5 dark:text-white">Kind remeber: Withdrawal will incur a partial handling fee, which will be received within 24 hours after withdrawal. If you have any questions, please <span className="underline text-primary-100">Contact Customer Service</span></p>

                <p className="dark:text-white">Handling fees: <span className="font-semibold">10USD</span></p>

                <Button 
                text="Confirm Withdrawal"
                className={"mt-5"}
                />
            </div>
        </div>
     );
}

export default WithdrawApply;