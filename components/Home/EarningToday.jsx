"use client"

import { contextProvider } from "@/contexts/Context";
import { useContext } from "react";
import Button from "../Form/Button";

function EarningToday() {
    const {walletAddress, connectWallet} = useContext(contextProvider)
    return ( 
        <div className="bg-gray-100 dark:bg-dark">
            <div className="container py-[60px] text-center">
                <h2 className="text-3xl lg:text-5xl font-semibold dark:text-white text-black lg:mb-8 mb-5">Start earning today</h2>
                {walletAddress === "" && <Button
                handleFunc={connectWallet}
                text="Log In Now"
                />}
            </div>
        </div>
     );
}

export default EarningToday;