import { footerUrls } from "@/constant";
import FooterCommunity from "./FooterCommunity";
import FooterCopyRight from "./FooterCopyright";
import FooterLinkCard from "./FooterLinkCard";

const Footer = () => {
  return (
    <div>
      <div className="pb-10 lg:flex justify-around items-start gap-x-16 pt-10 px-5 dark:text-white">
        <FooterCommunity />
        <FooterLinkCard title={"About Us"} items={footerUrls[0]} />
        {/* <MobileFooterLinks /> */}
        <div>
          <FooterLinkCard title={"Business"} items={footerUrls[1]} />
          <span className="block mt-5"></span>
          <FooterLinkCard title={"Learn"} items={footerUrls[2]} />
        </div>
        <div>
          <FooterLinkCard title={"Service"} items={footerUrls[3]} />
          <span className="block mt-5"></span>
          <FooterLinkCard title={"Support"} items={footerUrls[4]} />
        </div>
      </div>
      <FooterCopyRight />
    </div>
  );
};

export default Footer;
