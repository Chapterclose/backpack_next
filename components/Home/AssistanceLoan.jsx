import { BadgeDollarSign, BanknoteArrowDown, BatteryCharging, Bell, HandCoins, Handshake, MessageSquareMore, SendHorizonal, Users } from "lucide-react";
function AssistanceLoan() {
    return ( 
    <>
    <div className="container py-[40px] lg:py-[60px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-3 lg:gap-5 ">
            <div className="border border-green-400 rounded-xl text-center cursor-pointer dark:bg-grey-100 bg-white p-2 lg:p-6">
            <HandCoins className="mx-auto w-[20px] lg:w-[40px] h-[20px] lg:h-[40px] text-green-500 lg:mb-2"/>
            <h3 className="text-lg lg:text-2xl font-semibold text-gray-700 dark:text-white">Assistance Loan</h3>
            </div>
            <div className="border border-green-400 rounded-xl text-center cursor-pointer bg-white dark:bg-grey-100 p-2 lg:p-6">
                <SendHorizonal className="mx-auto w-[20px] lg:w-[40px] h-[20px] lg:h-[40px] text-green-500 lg:mb-2"/>
                <h3 className="text-lg lg:text-2xl font-semibold text-gray-700 dark:text-white">Convert</h3>
            </div>
            <div className="border border-green-400 rounded-xl text-center cursor-pointer bg-white dark:bg-grey-100 p-2 lg:p-6">
                <Users className="mx-auto w-[20px] lg:w-[40px] h-[20px] lg:h-[40px] text-green-500 lg:mb-2"/>
                <h3 className="text-lg lg:text-2xl font-semibold text-gray-700 dark:text-white">Promotion Center</h3>
            </div>
            <div className="border border-green-400 rounded-xl text-center cursor-pointer bg-white dark:bg-grey-100 p-2 lg:p-6">
                <Handshake className="mx-auto w-[20px] lg:w-[40px] h-[20px] lg:h-[40px] text-green-500 lg:mb-2"/>
                <h3 className="text-lg lg:text-2xl font-semibold text-gray-700 dark:text-white">Second Contract</h3>
            </div>
            <div className="border border-green-400 rounded-xl text-center cursor-pointer bg-white dark:bg-grey-100 p-2 lg:p-6">
                <BadgeDollarSign className="mx-auto w-[20px] lg:w-[40px] h-[20px] lg:h-[40px] text-green-500 lg:mb-2"/>
                <h3 className="text-lg lg:text-2xl font-semibold text-gray-700 dark:text-white">Financing</h3>
            </div>
        </div>

        <p className="my-6 lg:my-10 flex items-center gap-x-5 justify-center bg-gray-100 dark:bg-grey-100 py-5 lg:py-10 rounded-xl text-xl font-medium"><Bell className="mt-[5px]"/> Start your digital currency journey.</p>

        <div className="grid grid-cols-3 gap-3 lg:gap-5">
            <div className="bg-primary-100 hover:bg-primary duration-300 p-[15px] lg:p-[20px_30px] text-center rounded-xl cursor-pointer">
                <BatteryCharging className="mx-auto w-[40px] h-[40px] text-white"/>
                <h3 className="text-base lg:text-xl mt-3 font-semibold text-white">Quick coin charging</h3>
            </div>
            <div className="bg-primary-100 hover:bg-primary duration-300 p-[15px] lg:p-[20px_30px] text-center rounded-xl cursor-pointer">
                <BanknoteArrowDown className="mx-auto w-[40px] h-[40px] text-white"/>
                <h3 className="text-base lg:text-xl mt-3 font-semibold text-white">Quick withdraw of coin</h3>
            </div>
            <div className="bg-primary-100 hover:bg-primary duration-300 p-[15px] lg:p-[20px_30px] text-center rounded-xl cursor-pointer">
                <MessageSquareMore className="mx-auto w-[40px] h-[40px] text-white"/>
                <h3 className="text-base lg:text-xl mt-3 font-semibold text-white">Online Services</h3>
            </div>
        </div>
    </div> 
    </>
    );
}

export default AssistanceLoan;