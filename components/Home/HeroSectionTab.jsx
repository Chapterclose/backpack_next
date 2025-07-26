import { marketsDataArr } from "@/constant/marketsdata";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
const homePageTabs = [{ title: "Popular" }, { title: "New Listing" }];

const HeroSectionTab = () => {
  return (
    <TabGroup manual defaultIndex={0}>
      <TabList className="mb-5">
        {homePageTabs?.map((item) => (
          <Tab
            key={item.title}
            className="data-[selected]:text-t-primary relative text-secondary font-semibold mr-5 focus:outline-none data-[selected]:before:absolute data-[selected]:before:bottom-[-5px] data-[selected]:before:left-1/2 data-[selected]:before:-translate-x-1/2 data-[selected]:before:bg-yellow-300 data-[selected]:before:w-4 data-[selected]:before:h-[2px]"
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <table>
            <tbody>
              {marketsDataArr?.slice(0, 4).map((item) => (
                <tr key={item.id}>
                  <td className="pr-7">
                    <div className="flex items-center gap-x-3 mb-2">
                      <Image src={item?.img} width={30} height={30} alt="icon" />
                      <span className="text-t-primary">
                        {item.title} <span className="text-xs text-secondary">{item.subTitle}</span>{" "}
                      </span>
                    </div>
                  </td>
                  <td className="px-7 text-t-primary">${item.price}</td>
                  <td className="pl-7 text-green-500 font-semibold">+{item.changeRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
        <TabPanel>
          <table>
            <tbody>
              {marketsDataArr?.slice(5, 9).map((item) => (
                <tr key={item.id}>
                  <td className="pr-7">
                    <div className="flex items-center gap-x-3 mb-2">
                      <Image src={item?.img} width={30} height={30} alt="icon" />
                      <span>
                        {item.title} <span className="text-xs text-secondary">{item.subTitle}</span>{" "}
                      </span>
                    </div>
                  </td>
                  <td className="px-7">${item.price}</td>
                  <td className="pl-7 text-green-500 font-semibold">+{item.changeRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default HeroSectionTab;
