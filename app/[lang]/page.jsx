import HeroSectionTab from "@/components/Home/HeroSectionTab";
import HomeFaq from "@/components/Home/HomeFaq";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="py-10 grid lg:grid-cols-2">
        <div>
          <h2 className="text-[40px] lg:text-[60px] font-bold text-yellow-500">196,745,223</h2>
          <h4 className="font-semibold text-[40px] lg:text-[50px] text-t-primary">
            USERS <br /> <span>TRUST US</span>
          </h4>
        </div>

        <div className="dark:bg-slate-800 bg-[#FAFAFA] rounded-lg shadow-2xl p-5 max-w-[500px] mt-5 lg:mt-0">
          <HeroSectionTab />

          <Link href="/markets/overview" className="inline-block">
            <button className="text-t-primary flex items-center gap-x-2 text-sm mt-3 hover:text-white duration-300">
              View All 350+ Coins <FaAngleRight />
            </button>
          </Link>
        </div>
      </div>

      <HomeFaq />
    </>
  );
}
