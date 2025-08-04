"use client"

import React, { useState } from 'react';
import { ChevronDown, ArrowUpDown, Check } from 'lucide-react'; // Using lucide-react for icons
import Button from '@/components/Form/Button';

// The main App component for the Transfer system
const TransferPage = () => {
  // State for the selected assets and the transfer amount
  const [fromAsset, setFromAsset] = useState('Wealth management assets');
  const [toAsset, setToAsset] = useState('total assets');
  const [transferAmount, setTransferAmount] = useState('');
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  // Hardcoded asset types and their balances for demonstration
  const assetTypes = [
    'total assets',
    'Wealth management assets',
    'Contract assets',
    'Other assets',
  ];

  const availableBalances = {
    'total assets': '342423432.00 USDT',
    'Wealth management assets': '123456.78 USDT',
    'Contract assets': '98765.43 USDT',
    'Other assets': '1000.00 USDT',
  };

  // Function to handle the "Swap" button click
  const handleSwap = () => {
    // Swap the 'from' and 'to' assets
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  // Function to handle selecting an asset from the dropdown
  const handleSelectAsset = (asset, type) => {
    if (type === 'from') {
      setFromAsset(asset);
      setIsFromDropdownOpen(false);
    } else {
      setToAsset(asset);
      setIsToDropdownOpen(false);
    }
  };

  // Function to set the transfer amount to the available balance
  const handleMaxClick = () => {
    const balanceString = availableBalances[fromAsset].split(' ')[0].replace(/,/g, '');
    setTransferAmount(balanceString);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transfer</h1>

        {/* From and To asset selection section with swap icon on the right */}
        <div className="relative flex items-center space-x-4 mb-6">
          {/* Container for From and To dropdowns */}
          <div className="flex-grow bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
            {/* From asset dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between pb-2 border-b border-gray-200 cursor-pointer"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">From</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 font-medium capitalize">{fromAsset}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${isFromDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </div>
              </div>
              {/* From dropdown menu */}
              {isFromDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  {assetTypes.filter(asset => asset !== toAsset).map((asset) => (
                    <div
                      key={asset}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSelectAsset(asset, 'from')}
                    >
                      <span className="font-medium text-gray-800 capitalize">{asset}</span>
                      {fromAsset === asset && <Check className="w-5 h-5 text-primary-200" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To asset dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between pt-2 cursor-pointer"
                onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">to</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 font-medium capitalize">{toAsset}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${isToDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </div>
              </div>
              {/* To dropdown menu */}
              {isToDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  {assetTypes.filter(asset => asset !== fromAsset).map((asset) => (
                    <div
                      key={asset}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSelectAsset(asset, 'to')}
                    >
                      <span className="font-medium text-gray-800 capitalize">{asset}</span>
                      {toAsset === asset && <Check className="w-5 h-5 text-primary-200" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap button on the right */}
          <button
            onClick={handleSwap}
            className="flex-shrink-0 w-12 h-12 bg-primary-200 text-white rounded-full border border-gray-300 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <ArrowUpDown className="w-6 h-6" />
          </button>
        </div>

        {/* Transfer amount input section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Transfer amount</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-200">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-xl font-bold w-full outline-none focus:outline-none placeholder-gray-400 text-gray-900"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <button
                className="text-sm font-bold text-primary-200 uppercase"
                onClick={handleMaxClick}
              >
                Max
              </button>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-base font-bold text-gray-800">USDT</span>
            </div>
          </div>
        </div>

        {/* Available balance display */}
        <div className="text-sm text-gray-500">
          Available balance: <span className="font-bold text-gray-800">{availableBalances[fromAsset]}</span>
        </div>

        {/* Confirm button */}
        <div className="mt-8">
            <Button
            text={"Confirm Transfer"}
            className={"w-full"}
            />
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
