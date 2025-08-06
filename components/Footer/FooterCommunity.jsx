import { BiGlobe, BiLogoYoutube, BiMoon } from "react-icons/bi";

const FooterCommunity = () => {
  return (
    <div className="mb-5 lg:mb-0">
      <h4 className="text-lg font-semibold mb-4">Community</h4>
      <BiLogoYoutube className="text-2xl cursor-pointer" />

      <div className="mt-10 space-y-3">
        <h4 className="flex gap-x-2 items-center font-semibold">
          <BiGlobe /> English
        </h4>
        {/* <h4 className="flex gap-x-2 items-center font-semibold">
          Theme <BiMoon />
        </h4> */}
      </div>
    </div>
  );
};

export default FooterCommunity;
