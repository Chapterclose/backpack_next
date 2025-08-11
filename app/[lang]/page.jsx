import EarningToday from "@/components/Home/EarningToday";
import HeroSection from "@/components/Home/HeroSection";
import HomeFaq from "@/components/Home/HomeFaq";
import PopularCrypto from "@/components/Home/PopularCrypto";


export default function Home() {
  return (
    <>
      <HeroSection/>
      <PopularCrypto/>
      {/* <HomeFaq /> */}
      <EarningToday/>
    </>
  );
}
