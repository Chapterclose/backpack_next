import AccountBalance from "@/components/assets/AccountBalance";
import AssetDetails from "@/components/assets/AssetDetails";

function AssetsPage() {
    return ( 
        <div className="container py-[80px]">
            <AccountBalance/>
            <AssetDetails/>
        </div>
     );
}

export default AssetsPage;