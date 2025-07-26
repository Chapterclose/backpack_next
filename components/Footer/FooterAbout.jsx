import FooterLinks from "@/components/FooterLinks";
import { footerAboutUrls } from "@/constant";

const FooterAbout = () => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">About Us</h4>
      <FooterLinks items={footerAboutUrls} />
    </div>
  );
};

export default FooterAbout;
