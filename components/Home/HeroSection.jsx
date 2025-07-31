import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import Button from "../Form/Button";
import HeroSectionTab from "./HeroSectionTab";

function HeroSection() {
    return ( 
        <div className="container grid lg:grid-cols-2 gap-x-[200px] py-[40px] lg:py-[80px]">
            <div className="mb-10 lg:mb-0">
                <h2 className="text-[60px] lg:text-[80px] text-primary-200 font-bold">282,943,170</h2>
                <h3 className="text-[60px] xl:text-[80px] text-black uppercase font-bold leading-[80px] mb-8">Users <br />Trust Us</h3>
                <Button
                text="Sign Up"
                />
            </div>

            <div>
                <HeroSectionTab/>
                <button>
                    <Link href="/markets" className="text-gray-400 flex items-center gap-x-2 mt-3 hover:text-primary-100 duration-300">
                    View all Coins <BiRightArrowAlt/>
                    </Link>
                </button>
            </div>
        </div>
     );
}

export default HeroSection;