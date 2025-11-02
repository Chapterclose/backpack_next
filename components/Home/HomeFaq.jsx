"use client";

import { homeFaqData } from "@/constant";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { HiQuestionMarkCircle } from "react-icons/hi";

const HomeFaq = () => {
  const [activeCollapse, setActiveCollapse] = useState(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    contentRefs.current = homeFaqData.map((_, i) => contentRefs.current[i] ?? null);
  }, []);

  const handleCollapse = (i) => {
    setActiveCollapse((prev) => (prev === i ? null : i));
  };

  return (
    <div className="container py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 mb-4">
            <HiQuestionMarkCircle className="text-3xl text-primary" />
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {homeFaqData.map(({ title, url, id }, i) => (
            <div
              key={i}
              className={cn(
                "group rounded-xl border transition-all duration-300",
                activeCollapse === i
                  ? "bg-white dark:bg-gray-800 border-primary/20 shadow-lg"
                  : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-primary/10"
              )}
            >
              <div
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => handleCollapse(i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-sm md:text-base font-bold text-primary">
                      {id}
                    </span>
                    <h5 className="text-sm md:text-base lg:text-lg font-semibold text-black dark:text-white text-left">
                      {title}
                    </h5>
                  </div>
                  <div className="flex-shrink-0">
                    {activeCollapse === i ? (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-white transition-transform duration-300 rotate-180">
                        <FaMinus className="text-sm" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all duration-300">
                        <FaPlus className="text-sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              <div
                ref={(el) => (contentRefs.current[i] = el)}
                style={{
                  maxHeight:
                    activeCollapse === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px",
                }}
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  activeCollapse === i ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                  <p className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {url}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFaq;
