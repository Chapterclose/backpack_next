import AssistanceLoan from "@/components/Home/AssistanceLoan";
import BannerBottom from "@/components/Home/BannerBottom";
import HeroBanner from "@/components/Home/HeroBanner";
import Market from "@/components/Home/HomeMarketsOverview";

export default function Home() {
  return (
    <>
      <HeroBanner/>
      <BannerBottom/>
      <AssistanceLoan/>
      <Market/>
      {/* <HomeFaq /> */}
    </>
  );
}
