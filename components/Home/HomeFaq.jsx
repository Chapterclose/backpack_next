"use client";

import { homeFaqData } from "@/constant";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react"; // Import useRef and useEffect
import { FaMinus, FaPlus } from "react-icons/fa";

const HomeFaq = () => {
  const [activeCollapse, setActiveCollapse] = useState(null);
  const contentRefs = useRef([]); // Create a ref to store references to content elements

  // Initialize contentRefs array with nulls for each item
  useEffect(() => {
    contentRefs.current = homeFaqData.map((_, i) => contentRefs.current[i] ?? null);
  }, []);

  const handleCollapse = (i) => {
    setActiveCollapse((prev) => (prev === i ? null : i));
  };

  return (
    <div className="container pb-[60px]">
      <h3 className="text-4xl text-center font-semibold py-[50px] dark:text-white text-t-primary">
        Frequently Asked Questions
      </h3>
      {homeFaqData.map(({ title, url, id }, i) => (
        <React.Fragment key={i}>
          <div
            id={id}
            key={i}
            className={cn(
              "group rounded-xl p-5 mb-1 hover:text-black dark:text-white duration-300",
              activeCollapse === i && "bg-black-100"
            )}
          >
            <h5
              className={cn(
                "dark:group-hover:text-white cursor-pointer text-[14px] lg:text-[16px] xll:text-[20px] leading-[145%] font-medium text-heading flex justify-between items-center duration-300"
              )}
              onClick={() => handleCollapse(i)}
            >
              <span>
                {" "}
                <span className="border border-gray-700 px-2 py-1 rounded mr-3 ">{id}</span> {title}
              </span>

              <span className="text-lg text-black/20">
                {activeCollapse === i ? (
                  <FaMinus
                    className={cn(
                      "text-black",
                      activeCollapse === i && "bg-primary w-8 h-8 p-2 rounded-full"
                    )}
                  />
                ) : (
                  <FaPlus className={cn("text-black dark:text-white")} />
                )}
              </span>
            </h5>
            {/* Dynamic max-height for smooth transition */}
            <div
              ref={(el) => (contentRefs.current[i] = el)} // Assign ref to the div
              style={{
                maxHeight:
                  activeCollapse === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px",
              }}
              className={cn(
                "overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out", // Transition both max-height and opacity
                activeCollapse === i ? "opacity-100 mt-[12px]" : "opacity-0"
              )}
            >
              <p className="text-[12px] md:text-[10px] lg:text-[14px] xxl:text-[16px] leading-[160%] text-body pr-[20px] text-secondary dark:text-white">
                {url}
              </p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default HomeFaq;
