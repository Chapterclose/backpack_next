"use client"

import btcImg from "@/assets/markets/1.png";
import ethImg from "@/assets/markets/2.png";
import usdImg from "@/assets/markets/usdt.png";
import Heading from '@/components/common/Heading';
import Button from '@/components/Form/Button';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge'; // Import twMerge

const ConvertPage = () => {
  // State for the currency inputs and selected currencies
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  // Changed default fromCurrency to 'USDT-ERC'
  const [fromCurrency, setFromCurrency] = useState('USDT-ERC'); 
  const [toCurrency, setToCurrency] = useState('ETH'); // Changed default toCurrency to 'ETH'

  // State to manage the visibility of the currency dropdowns
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFromDropdownOpen &&
        !event.target.closest('.from-dropdown-container')
      ) {
        setIsFromDropdownOpen(false);
      }
      if (
        isToDropdownOpen &&
        !event.target.closest('.to-dropdown-container')
      ) {
        setIsToDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFromDropdownOpen, isToDropdownOpen]);


  const availableBalances = {
    'USDT-ERC': '1,200.00',
    'ETH': '5.25',
    'BTC': '0.50',
    'USDT-TRC': '1,500.00', 
  };

  const exchangeRates = {
    'USDT-ERC': {
      'ETH': 0.00025,
      'BTC': 0.000016,
      'USDT-TRC': 1.00, 
    },
    'ETH': {
      'USDT-ERC': 4000.00,
      'BTC': 0.065,
      'USDT-TRC': 4000.00, 
    },
    'BTC': {
      'USDT-ERC': 62500.00,
      'ETH': 15.38,
      'USDT-TRC': 62500.00, 
    },
    'USDT-TRC': {
      'USDT-ERC': 1.00, 
      'ETH': 0.00025,
      'BTC': 0.000016,
    },
  };


  const currencies = [
    { name: 'ETH', symbol: ethImg },
    { name: 'USDT-ERC', symbol: usdImg }, 
    { name: 'BTC', symbol: btcImg },
    { name: 'USDT-TRC', symbol: usdImg }, 
  ];

  const calculateConversion = useCallback(() => {
    if (fromValue && exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      const newToValue = parseFloat(fromValue) * rate;
      setToValue(newToValue.toFixed(8));
    } else {
      setToValue('');
    }
  }, [fromValue, fromCurrency, toCurrency, exchangeRates]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const handleSwap = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const handleSelectCurrency = (currency, type) => {
    if (type === 'from') {
      setFromCurrency(currency);
      setIsFromDropdownOpen(false);
    } else {
      setToCurrency(currency);
      setIsToDropdownOpen(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 dark:bg-dark min-h-screen py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text={"Convert"} />

        {/* Available Balance Display */}
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">{availableBalances[fromCurrency]}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Available balance ({fromCurrency})</p>
        </div>

        {/* "From" currency input section */}
        <div className="relative mb-5 from-dropdown-container">
          <div className={twMerge(
            "flex items-center justify-between px-4 py-3",
            "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm",
            "bg-gray-100 dark:bg-gray-700",
            "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary",
            "transition-all duration-200 ease-in-out"
          )}>
            <input
              type="number"
              placeholder="Please enter"
              className={twMerge(
                "bg-transparent text-xl font-medium w-full outline-none",
                "placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500",
                "flex-grow" // Allow input to grow and take available space
              )}
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
            />
            <div className="flex items-center space-x-2 flex-shrink-0"> {/* Add flex-shrink-0 to prevent shrinking */}
              <button
                className="text-xs text-green-500 font-semibold uppercase hover:text-green-600 transition-colors"
                onClick={() => setFromValue(availableBalances[fromCurrency].replace(/,/g, ''))}
              >
                Max
              </button>
              <div
                className="flex items-center cursor-pointer space-x-1"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-md font-bold text-gray-900 dark:text-gray-100 min-w-[75px] text-right"> {/* Adjusted font-size and added min-width, text-right */}
                    {fromCurrency}
                </span>
                <Image
                  src={currencies.find(c => c.name === fromCurrency)?.symbol}
                  className='w-[20px] h-[20px]'
                  />
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${isFromDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* "From" currency dropdown */}
          {isFromDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies.filter(c => c.name !== toCurrency).map((currency) => (
                <div
                  key={currency.name}
                  className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSelectCurrency(currency.name, 'from')}
                >
                  <Image
                  src={currency.symbol}
                  className='w-[20px] h-[20px]'
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{currency.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95 hover:border-blue-400 hover:ring-1 hover:ring-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* "To" currency output section */}
        <div className="relative to-dropdown-container">
          <div className={twMerge(
            "flex items-center justify-between px-4 py-3",
            "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm",
            "bg-gray-100 dark:bg-gray-700",
            "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary",
            "transition-all duration-200 ease-in-out"
          )}>
            <input
              type="text"
              readOnly
              className={twMerge(
                "bg-transparent text-xl font-medium w-full outline-none",
                "placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500",
                "flex-grow" // Allow input to grow and take available space
              )}
              value={toValue}
            />
            <div
              className="flex items-center cursor-pointer space-x-1 flex-shrink-0" // Add flex-shrink-0 to prevent shrinking
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <span className="text-md font-bold text-gray-900 dark:text-gray-100 min-w-[75px] text-right"> {/* Adjusted font-size and added min-width, text-right */}
                  {toCurrency}
              </span> 
              <Image
                  src={currencies.find(c => c.name === toCurrency)?.symbol}
                  className='w-[20px] h-[20px]'
                  />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${isToDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* "To" currency dropdown */}
          {isToDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
              {currencies.filter(c => c.name !== fromCurrency).map((currency) => (
                <div
                  key={currency.name}
                  className="flex items-center gap-x-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSelectCurrency(currency.name, 'to')}
                >
                  <Image
                  src={currency.symbol}
                  className='w-[20px] h-[20px]'
                  />
                  <span className="font-medium text-gray-800 dark:text-gray-200">{currency.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exchange rate display */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Today's exchange rate: 1{fromCurrency} = {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(8) || 'N/A'}{toCurrency}
        </div>


        <Button
          text={"Confirm"}
          className={"w-full mt-10"}
        />
      </div>
    </div>
  );
};

export default ConvertPage;