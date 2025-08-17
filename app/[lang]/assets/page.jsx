"use client"

import AccountBalance from "@/components/assets/AccountBalance";
import AssetDetails from "@/components/assets/AssetDetails";
import Button from "@/components/Form/Button";
import { contextProvider } from "@/contexts/Context";
import UserStore from "@/store/UserStore";
import { useContext, useEffect, useState } from "react";

function AssetsPage() {
    const [showBalance, setShowBalance] = useState(true);
    const {walletAddress, connectWallet} = useContext(contextProvider);
    const {GetAccountBalanceRequest} = UserStore()
    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };


    useEffect(()=>{
        GetAccountBalanceRequest()
    },[])

    return ( 
        <>
            {walletAddress !== "" ? <div className="container py-[80px] dark:text-white">
                <AccountBalance showBalance={showBalance} toggleBalanceVisibility={toggleBalanceVisibility} />
                <AssetDetails showBalance={showBalance}/>
            </div>
            :
            <div className="flex flex-col text-center items-center justify-center py-[60px] lg:py-[100px] px-5 lg:px-0"> 
                <h2 className="text-3xl lg:text-4xl font-semibold capitalize mb-5 dark:text-white">Let's start you crypto journey with us.</h2>
                <Button
                text={"Connect Now"}
                handleFunc={connectWallet}
                />
            </div>    
        }
        </>
     );
}

export default AssetsPage;