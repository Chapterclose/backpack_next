
function HeroBanner() {
    return (
    <div>
        <div className={`bg-[url(../../assets/hero.jpg)] w-full bg-cover bg-center bg-no-repeat h-[40vh] lg:h-[60vh] relative before:absolute before:bg-black before:inset-0 before:content-[""] before:opacity-70 before:z-[-10] z-[-10]`}>
            <h2 className="text-white font-semibold z-10 text-5xl lg:text-8xl text-center pt-[50px] max-w-[700px] mx-auto">Explore Digital Currency World</h2>
        </div>

        {/* <div className="container grid grid-cols-3 rounded-lg shadow-lg bg-white mt-[-30px] z-[100px] border-b-4 border-primary">
            <div className="text-center py-5">
                <h3 className="text-[24px] lg:text-[40px] font-semibold text-gray-700">BTC/USDT</h3>
                <h4 className="text-[20px] font-semibold text-red-500">-0.41%</h4>
                <h4 className="text-[20px] font-semibold text-red-500">118982.25</h4>
            </div>
            <div className="text-center py-5">
                <h3 className="text-[24px] lg:text-[40px] font-semibold text-gray-700">ETH/USDT</h3>
                <h4 className="text-[20px] font-semibold text-red-500">-0.41%</h4>
                <h4 className="text-[20px] font-semibold text-red-500">118982.25</h4>
            </div>
            <div className="text-center py-5">
                <h3 className="text-[24px] lg:text-[40px] font-semibold text-gray-700">MPLX/USDT</h3>
                <h4 className="text-[20px] font-semibold text-green-500">+2.63%</h4>
                <h4 className="text-[20px] font-semibold text-green-500">118982.25</h4>
            </div>
        </div> */}
    </div> );
}

export default HeroBanner;