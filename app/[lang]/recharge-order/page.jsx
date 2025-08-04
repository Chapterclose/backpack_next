"use client"; 

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RechargeOrder() {
  const [activeTab, setActiveTab] = useState('Whole');

  const tabs = [
    { id: 'Whole', label: 'Whole', content: "There is currently no data available " },
    { id: 'Auditing', label: 'Auditing', content: "There is currently no data available " },
    { id: 'Success', label: 'Success', content: "There is currently no data available " },
    { id: 'Fail', label: 'Fail', content: "An error occurred. Data for 'Fail'." },
  ];

  const activeTabItem = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen container py-[40px] lg:py-[60px] font-inter antialiased">
        <div>
            <h4 className="text-3xl lg:text-center font-semibold text-black mb-5 lg:mb-10">Recharge Record</h4>
        </div>
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        
        {/* The tab navigation bar */}
        <div className="relative flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-6 py-4 text-center text-sm font-medium transition-colors duration-300
                ${activeTab === tab.id ? 'text-primary-200' : 'text-gray-900 hover:text-primary-200'}
                focus:outline-none
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* The tab content area */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* This is the content area with the image and text */}
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-40 h-40 text-gray-200 mb-8"
                  fill="currentColor"
                >
                  <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zM31.5 491.5C9.9 499.3-5.3 479.9 2.5 458.3l37.8-100.8c5.4-14.4 18.8-24.8 34.6-26.6 65.6-7.5 129.5-7.5 195.1 0 15.8 1.8 29.2 12.2 34.6 26.6l37.8 100.8c7.8 21.6-7.4 41-29 48.8-5.3 1.9-10.9 2.8-16.5 2.8-14.8 0-28.5-7.7-36.2-20.5l-20.6-34.4c-2.3-3.8-6.1-6.1-10.4-6.4-15.6-1.2-31.2-1.2-46.8 0-4.3 .3-8.1 2.6-10.4 6.4l-20.6 34.4c-7.7 12.8-21.4 20.5-36.2 20.5-5.6 0-11.2-.9-16.5-2.8z"/>
                </svg>
                <div className="text-xl text-gray-900 font-semibold mb-2">
                  {/* The content for the active tab */}
                  {activeTabItem.content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
