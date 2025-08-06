"use client"

import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import Button from "../Form/Button";
import HeroSectionTab from "./HeroSectionTab";
import { useContext } from "react";
import { contextProvider } from "@/contexts/Context";

function HeroSection() {
    const {walletAddress, connectWallet} = useContext(contextProvider)
    return ( 
        <div className="container grid lg:grid-cols-2 gap-x-[200px] py-[40px] lg:py-[80px]">
            <div className="mb-10 lg:mb-0">
                <h2 className="text-3xl md:text-[60px] lg:text-[80px] text-primary-200 font-bold">282,943,170</h2>
                <h3 className="text-3xl md:text-[60px] xl:text-[80px] text-black uppercase font-bold leading-[80px] mb-2 lg:mb-8 dark:text-white">Users <br className="hidden lg:block" />Trust Us</h3>
                
                {walletAddress === "" && <Button
                handleFunc={connectWallet}
                text="Connect"
                className={"px-14"}
                />}
            </div>

            <div>
                <HeroSectionTab/>
                <button>
                    <Link href="/markets" className="text-black dark:text-white flex items-center gap-x-2 mt-10 hover:text-primary-100 duration-300">
                    View all Coins <BiRightArrowAlt/>
                    </Link>
                </button>
            </div>
        </div>
     );
}

export default HeroSection;