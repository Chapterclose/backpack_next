"use client"

import Heading from '@/components/common/Heading';
import Button from '@/components/Form/Button';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge'; // Import twMerge

const ConvertPage = () => {
  // State for the currency inputs and selected currencies
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  // Changed default fromCurrency to 'USDT'
  const [fromCurrency, setFromCurrency] = useState('USDT'); 
  const [toCurrency, setToCurrency] = useState('TRX'); // Changed default toCurrency to 'TRX' as TRX is the other common currency for USDT. You might want to adjust this based on your preference or logic.

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
    TRX: '15,345.54',
    USDT: '1,200.00', // Ensure this balance is correct
    DOGE: '50,000.00',
    BTC: '0.50',
    ETH: '5.25',
    XRP: '10,000.00',
  };

  const exchangeRates = {
    TRX: {
      USDT: 0.3295,
      DOGE: 5.12,
      BTC: 0.000005,
      ETH: 0.00008,
      XRP: 0.65,
    },
    USDT: {
      TRX: 3.0349,
      DOGE: 15.54,
      BTC: 0.000015,
      ETH: 0.00024,
      XRP: 1.98,
    },
    // Add other exchange rates as needed for all currencies
    DOGE: { TRX: 0.195, USDT: 0.064, BTC: 0.0000009, ETH: 0.000015, XRP: 0.12 },
    BTC: { TRX: 200000, USDT: 65000, DOGE: 10000000, ETH: 15, XRP: 120000 },
    ETH: { TRX: 12000, USDT: 4000, DOGE: 65000, BTC: 0.065, XRP: 7500 },
    XRP: { TRX: 1.5, USDT: 0.5, DOGE: 8, BTC: 0.000008, ETH: 0.00013 },
  };


  const currencies = [
    { name: 'ETH', symbol: '💎' },
    { name: 'USDT', symbol: 'Ⓣ' }, // Changed USDT-ERC to USDT for simplicity, assuming it represents USDT generally. Adjust if USDT-ERC and USDT-TRC are distinct in your context.
    { name: 'BTC', symbol: '₿' },
    { name: 'TRX', symbol: 'Ξ' }, // Changed USDT-TRC to TRX for consistency with other currency names. Adjust if USDT-TRC is a distinct token.
    { name: 'DOGE', symbol: '🐶' }, // Added DOGE
    { name: 'XRP', symbol: ' Ripple' }, // Added XRP
  ];

  // Modified calculateConversion to use actual exchange rates
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

  // Function to handle the "Swap" button click
  const handleSwap = () => {
    // Swap currencies
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    // Swap values and then recalculate
    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);

    // Recalculate after swap
    // This will be handled by the useEffect watching fromValue, fromCurrency, toCurrency
  };


  // Function to handle currency selection from dropdown
  const handleSelectCurrency = (currency, type) => {
    if (type === 'from') {
      setFromCurrency(currency);
      setIsFromDropdownOpen(false);
    } else {
      setToCurrency(currency);
      setIsToDropdownOpen(false);
    }
    // Recalculate after currency change
    // This will be handled by the useEffect watching fromValue, fromCurrency, toCurrency
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
        <div className="relative mb-5 from-dropdown-container"> {/* Increased mb and added container class */}
          <div className={twMerge(
            "flex items-center justify-between px-4 py-3", // Matched FormInput padding
            "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm", // Matched FormInput border, rounded, shadow
            "bg-gray-100 dark:bg-gray-700", // Background color for the container
            "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary", // Focus style for the whole input group
            "transition-all duration-200 ease-in-out" // Smooth transitions
          )}>
            <input
              type="number"
              placeholder="Please enter"
              className={twMerge(
                "bg-transparent text-xl font-medium w-full outline-none",
                "placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500" // Matched placeholder/text color
              )}
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
            />
            <div className="flex items-center space-x-2">
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
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{fromCurrency}</span>
                {/* Changed symbol lookup to directly use currency name for better matching */}
                <span className="text-sm text-gray-600 dark:text-gray-300">{currencies.find(c => c.name === fromCurrency)?.symbol}</span> 
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
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSelectCurrency(currency.name, 'from')}
                >
                  <span className="mr-3 text-lg">{currency.symbol}</span>
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
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95 hover:border-blue-400 hover:ring-1 hover:ring-blue-400" // Added hover effects
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 dark:text-gray-300" // Dark mode text color
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* "To" currency output section */}
        <div className="relative to-dropdown-container"> {/* Added container class */}
          <div className={twMerge(
            "flex items-center justify-between px-4 py-3", // Matched FormInput padding
            "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm", // Matched FormInput border, rounded, shadow
            "bg-gray-100 dark:bg-gray-700", // Background color for the container
            "focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary", // Focus style for the whole input group
            "transition-all duration-200 ease-in-out" // Smooth transitions
          )}>
            <input
              type="text"
              readOnly
              className={twMerge(
                "bg-transparent text-xl font-medium w-full outline-none",
                "placeholder-gray-400 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500" // Matched placeholder/text color
              )}
              value={toValue}
            />
            <div
              className="flex items-center cursor-pointer space-x-1"
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{toCurrency}</span>
              {/* Changed symbol lookup to directly use currency name for better matching */}
              <span className="text-sm text-gray-600 dark:text-gray-300">{currencies.find(c => c.name === toCurrency)?.symbol}</span> 
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
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSelectCurrency(currency.name, 'to')}
                >
                  <span className="mr-3 text-lg">{currency.symbol}</span>
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