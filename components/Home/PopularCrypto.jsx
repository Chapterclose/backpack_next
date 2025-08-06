import MarketTable from "../common/MarketTable";

const PopularCrypto = () => {

  return (
    <div className="container py-[40px] lg:py-[60px]">
        <h2 className="text-2xl md:text-4xl lg:text-6xl text-black dark:text-white capitalize font-bold mb-10">Popular cryptocurrencies
            </h2>
        
        <MarketTable ss={0} se={12}/>
    </div>
  );
};

export default PopularCrypto;