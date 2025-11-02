import EarningToday from "@/components/Home/EarningToday";
import HeroSection from "@/components/Home/HeroSection";
import HomeFaq from "@/components/Home/HomeFaq";
import PopularCrypto from "@/components/Home/PopularCrypto";


export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection/>
      <PopularCrypto/>
      <EarningToday/>
      <HomeFaq />
    </main>
  );
}
