"use client";

import { footerUrls } from "@/constant";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react"; // Import useRef and useEffect
import { FaMinus, FaPlus } from "react-icons/fa";

const MobileFooterLinks = () => {
  // states
  const [activeCollapse, setActiveCollapse] = useState(null);
  const contentRefs = useRef([]); // Create a ref to store references to content elements

  // Initialize contentRefs array with nulls for each item
  useEffect(() => {
    contentRefs.current = footerUrls.map((_, i) => contentRefs.current[i] ?? null);
  }, []);

  const handleCollapse = (i) => {
    setActiveCollapse((prev) => (prev === i ? null : i));
  };

  // Helper function to get the title based on index
  const getTitleByIndex = (index) => {
    switch (index) {
      case 0:
        return "About Us";
      case 1:
        return "Business";
      case 2:
        return "Learn";
      case 3:
        return "Service";
      case 4:
        return "Support";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Mobile Footer Accordion */}
      {footerUrls.map((item, i) => (
        <div
          id={i}
          key={i}
          className={cn(
            "group rounded-xl p-5 mb-1 duration-300 md:hidden"
            // You can uncomment this if you want a background change when active
            // activeCollapse === i && "bg-gray-100 dark:bg-gray-800"
          )}
        >
          <h5
            className={cn(
              "cursor-pointer text-[14px] lg:text-[16px] xll:text-[20px] leading-[145%] font-medium text-heading flex justify-between items-center duration-300 dark:text-white" // Added dark:text-white for consistency
            )}
            onClick={() => handleCollapse(i)}
          >
            {getTitleByIndex(i)}
            <span className="text-xl text-black/20 dark:text-white/20">
              {" "}
              {/* Added dark:text-white/20 for consistency */}
              {activeCollapse === i ? (
                <FaMinus
                  className={cn(
                    "text-black dark:text-white",
                    activeCollapse === i && "bg-primary w-8 h-8 p-2 rounded-full"
                  )}
                />
              ) : (
                <FaPlus className={cn("text-black dark:text-white")} />
              )}
            </span>
          </h5>
          {/* Manual Collapsible Content with Transitions */}
          <div
            ref={(el) => (contentRefs.current[i] = el)} // Assign ref to the div
            style={{
              maxHeight: activeCollapse === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px",
            }}
            className={cn(
              "overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out",
              activeCollapse === i ? "opacity-100 mt-[12px]" : "opacity-0"
            )}
          >
            {item?.map((urls, urlIndex) => (
              <p
                key={urlIndex} // Using urlIndex as key since urls.title might not be unique if titles repeat across different footer sections
                className="text-[12px] md:text-[10px] lg:text-[14px] xxl:text-[16px] leading-[160%] text-body pr-[20px] capitalize cursor-pointer dark:text-white/80" // Added dark:text-white/80 for dark mode
              >
                {urls.title}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default MobileFooterLinks;
