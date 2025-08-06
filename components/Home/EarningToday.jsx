import Button from "../Form/Button";

function EarningToday() {
    return ( 
        <div className="bg-gray-100 dark:bg-dark">
            <div className="container py-[60px] text-center">
                <h2 className="text-3xl lg:text-5xl font-semibold dark:text-white text-black lg:mb-8 mb-5">Start earning today</h2>
                <Button
                text="Connect Now"
                />
            </div>
        </div>
     );
}

export default EarningToday;