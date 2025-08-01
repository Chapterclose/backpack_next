"use client";

import { footerUrls } from "@/constant";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Collapsible from "react-collapsible";
import { FaMinus, FaPlus } from "react-icons/fa";

const MobileFooterLinks = () => {
  // states
  const [activeCollapse, setActiveCollapse] = useState();

  const handleCollapse = (i) => {
    setActiveCollapse((prev) => (prev === i ? null : i));
  };
  return (
    <>
      {/* Mobile Footer Accordion  */}
      {footerUrls.map((item, i) => (
        <div
          id={item.id}
          key={i}
          className={cn(
            "group rounded-xl p-5 mb-1 duration-300 md:hidden",
            //   i === 0 && "!pt-0",
            // activeCollapse === i && ""
          )}
        >
          <h5
            className={cn(
              "cursor-pointer text-[14px] lg:text-[16px] xll:text-[20px] leading-[145%] font-medium text-heading flex justify-between items-center duration-300"
              // activeCollapse === i ? "p-0" : "p-5"
            )}
            onClick={() => handleCollapse(i)}
          >
            {i === 0 && "About Us"}
            {i === 1 && "Business"}
            {i === 2 && "Learn"}
            {i === 3 && "Service"}
            {i === 4 && "Support"}
            <span className="text-xl text-black/20">
              {activeCollapse === i ? (
                <FaMinus
                  className={cn(
                    "text-black ",
                    // activeCollapse === i && ""
                  )}
                  activeCollapse={activeCollapse}
                  i={i}
                />
              ) : (
                <FaPlus
                  className={cn(
                    "text-black",
                    // activeCollapse === i && "text-yellow-300"
                  )}
                />
              )}
            </span>
          </h5>
          <Collapsible trigger="" open={i === activeCollapse} transitionTime={200}>
            {item?.map((urls) => (
              <p
                key={urls.id}
                className="text-[12px] md:text-[10px] lg:text-[14px] xxl:text-[16px] leading-[160%] text-body pr-[20px] xll:mt-[20px] lg:mt-[7px] mt-[12px] text-secondary capitalize cursor-pointer"
              >
                {urls.title}
              </p>
            ))}
          </Collapsible>
        </div>
      ))}
    </>
  );
};

export default MobileFooterLinks;
