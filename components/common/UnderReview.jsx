import { SearchCheckIcon } from "lucide-react";

function UnderReview() {
    return ( 
        <div className="text-center py-10">
            <SearchCheckIcon className="mx-auto w-[150px] h-[150px] text-green-500"/>
            <h3 className="text-7xl font-semibold text-gray-700">Under Review</h3>
        </div>
     );
}

export default UnderReview;