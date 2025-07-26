"use client";

import { homeFaqData } from "@/constant";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Collapsible from "react-collapsible";
import { FaMinus, FaPlus } from "react-icons/fa";

const HomeFaq = () => {
  // states
  const [activeCollapse, setActiveCollapse] = useState();

  const handleCollapse = (i) => {
    setActiveCollapse((prev) => (prev === i ? null : i));
  };

  return (
    <>
      <h3 className="text-4xl text-center font-semibold py-[80px] text-t-primary">
        Frequently Asked Questions
      </h3>
      {homeFaqData.map(({ title, url, id }, i) => (
        <React.Fragment key={i}>
          <div
            id={id}
            key={i}
            className={cn(
              "group rounded-xl p-5 mb-1 hover:bg-black-100 duration-300",
              //   i === 0 && "!pt-0",
              activeCollapse === i && "bg-black-100"
            )}
          >
            <h5
              className={cn(
                "group-hover:text-white cursor-pointer text-[14px] lg:text-[16px] xll:text-[20px] leading-[145%] font-medium text-heading flex justify-between items-center duration-300"
                // activeCollapse === i ? "p-0" : "p-5"
              )}
              onClick={() => handleCollapse(i)}
            >
              <span>
                {" "}
                <span className="border border-gray-700 px-2 py-1 rounded mr-3 ">{id}</span> {title}
              </span>

              <span className="text-xl text-black/20">
                {activeCollapse === i ? (
                  <FaMinus
                    className={cn(
                      "text-white group-hover:text-yellow-300",
                      activeCollapse === i && "text-yellow-300"
                    )}
                    activeCollapse={activeCollapse}
                    i={i}
                  />
                ) : (
                  <FaPlus
                    className={cn(
                      "text-white group-hover:text-yellow-300",
                      activeCollapse === i && "text-yellow-300"
                    )}
                  />
                )}
              </span>
            </h5>
            <Collapsible trigger="" open={i === activeCollapse} transitionTime={200}>
              <p className="text-[12px] md:text-[10px] lg:text-[14px] xxl:text-[16px] leading-[160%] text-body pr-[20px] xll:mt-[20px] lg:mt-[7px] mt-[12px] text-secondary">
                {url}
              </p>
            </Collapsible>
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default HomeFaq;
