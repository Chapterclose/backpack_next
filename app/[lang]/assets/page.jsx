"use client"

import AccountBalance from "@/components/assets/AccountBalance";
import AssetDetails from "@/components/assets/AssetDetails";
import { useState } from "react";

function AssetsPage() {
    const [showBalance, setShowBalance] = useState(true);

    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };
    return ( 
        <div className="container py-[80px] dark:text-white">
            <AccountBalance showBalance={showBalance} toggleBalanceVisibility={toggleBalanceVisibility} />
            <AssetDetails showBalance={showBalance}/>
        </div>
     );
}

export default AssetsPage;