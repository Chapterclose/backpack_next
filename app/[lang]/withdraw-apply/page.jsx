"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { ArrowLeft, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import usdtImg from "@/assets/markets/usdt.png"
import FormPassword from "@/components/Form/FormPassword";
function WithdrawApply({searchParams}) {
    const {coin} = searchParams;
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
                <h4 className="text-3xl font-semibold text-black mb-4 flex gap-x-3">
                    <button onClick={()=>window.history.back()}> <ArrowLeft className="pt-1 cursor-pointer"/> </button>
                    Withdrawal Apply{coin}</h4>

                <Link href="/withdraw-order" className="flex items-center gap-x-1 text-xl font-semibold border border-primary-100 p-[5px_15px] rounded hover:border-primary-200 duration-300">History <BookMarked className="mt-1"/></Link>
            </div>


            <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg py-5 px-2 lg:p-5">
                <div className="border-b pb-10 mb-10 border-gray-200 text-center">
                    <h4 className="text-6xl mb-2 text-black font-semibold">0.00</h4>
                    <p className="text-black font-medium">Available Balance(USDT-ETC)</p>
                </div>


                <div className="mb-4">
                    <label className="text-lg mb-2 block font-medium">Withdrawal currency (USDT-ERC)</label>
                    <div className={"w-full h-10 rounded pl-4 bg-gray-100 flex items-center gap-x-4 font-semibold"}>
                        <Image src={usdtImg} width={25} height={25} /> <h4>USDT-ERC</h4>
                    </div>
                </div>

                <div className="relative">
                    <FormInput
                    label="Withdrawal Amount"
                    placeholder="Please enter"
                    className="mb-5"
                    type="number"
                    />
                    <span className="absolute right-3 text-lg bottom-[26px] text-primary-200 font-semibold">Max</span>
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


                <p className="my-5">Kind remeber: Withdrawal will incur a partial handling fee, which will be received within 24 hours after withdrawal. If you have any questions, please <span className="underline text-primary-100">Contact Customer Service</span></p>

                <p>Handling fees: <span className="font-semibold">10USD</span></p>

                <Button 
                text="Confirm Withdrawal"
                className={"mt-5"}
                />
            </div>
        </div>
     );
}

export default WithdrawApply;