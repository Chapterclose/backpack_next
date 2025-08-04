"use client"

import qr from "@/assets/qr-code.png";
import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { ArrowLeft, BookMarked, Camera, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
function RechargeApply({searchParams}) {
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
                    Recharge ETH{coin}</h4>

                <Link href="/recharge-order" className="flex items-center gap-x-1 text-xl font-semibold border border-primary-100 p-[5px_15px] rounded hover:border-primary-200 duration-300">History <BookMarked className="mt-1"/></Link>
            </div>

            <Image
            src={qr}
            width={200}
            height={200}
            className="mx-auto"
            />

            <div className="mt-5 mb-5">
                <h4 className="text-lg mb-2 block font-medium">Recharge Address (ETH)</h4>
                <p className="flex items-center gap-x-3 text-gray-900">0xa8d2bbE4b181948B8C78709c3603E91DCd25Ff06 <Copy className="text-green-500 cursor-pointer"/> </p>
            </div>

            <FormInput
            label="Recharge Amount"
            placeholder="Please enter"
            className="md:max-w-[375px] mb-5"
            />

            <div className="mb-5">
                <h4 className="text-lg mb-2 block font-medium">Upload Screenshot or payment details</h4>
                <div
                    className="border border-gray-600 rounded-md h-36 flex items-center justify-center cursor-pointer hover:border-gray-400 transition md:max-w-[375px]"
                    onClick={handleClick}
                >
                    <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                />

            </div>

            <Button 
            text="Confirm Recharge"
            />
        </div>
     );
}

export default RechargeApply;