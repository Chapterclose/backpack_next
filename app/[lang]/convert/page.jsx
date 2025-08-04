"use client"

import Button from '@/components/Form/Button';
import React, { useState, useEffect, useCallback } from 'react';

const ConvertPage = () => {
  // State for the currency inputs and selected currencies
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromCurrency, setFromCurrency] = useState('TRX');
  const [toCurrency, setToCurrency] = useState('USDT');

  // State to manage the visibility of the currency dropdowns
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);

  const availableBalances = {
    TRX: '15,345.54',
    USDT: '1,200.00',
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
  };

  const currencies = [
    { name: 'TRX', symbol: '💎' },
    { name: 'USDT', symbol: 'Ⓣ' },
    { name: 'DOGE', symbol: '🐕' },
    { name: 'BTC', symbol: '₿' },
    { name: 'ETH', symbol: 'Ξ' },
    { name: 'XRP', symbol: ' XRP' },
  ];

  const calculateConversion = useCallback(() => {
    if (fromValue) {
      const randomMultiplier = Math.random() * 100;
      const newToValue = parseFloat(fromValue) * randomMultiplier;
      setToValue(newToValue.toFixed(8));
    } else {
      setToValue('');
    }
  }, [fromValue]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  // Function to handle the "Swap" button click
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromValue(toValue);
    setToValue(fromValue);
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
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Convert</h1>

        {/* Available Balance Display */}
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-gray-900 mb-2">{availableBalances[fromCurrency]}</p>
          <p className="text-sm text-gray-500">Available balance({fromCurrency})</p>
        </div>

        {/* "From" currency input section */}
        <div className="relative mb-4">
          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
            <input
              type="number"
              placeholder="Please enter"
              className="bg-transparent text-xl font-medium w-full outline-none focus:outline-none placeholder-gray-400 text-gray-900"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <button
                className="text-xs text-green-500 font-semibold uppercase"
                onClick={() => setFromValue(availableBalances[fromCurrency].replace(/,/g, ''))}
              >
                Max
              </button>
              <div
                className="flex items-center cursor-pointer space-x-1"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-lg font-bold text-gray-900">{fromCurrency}</span>
                <span className="text-sm">{currencies.find(c => c.name === fromCurrency)?.symbol}</span>
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
            <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
              {currencies.filter(c => c.name !== toCurrency).map((currency) => (
                <div
                  key={currency.name}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectCurrency(currency.name, 'from')}
                >
                  <span className="mr-3 text-lg">{currency.symbol}</span>
                  <span className="font-medium text-gray-800">{currency.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="w-12 h-12 bg-white rounded-full border border-gray-300 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* "To" currency output section */}
        <div className="relative">
          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-sm border border-gray-200">
            <input
              type="text"
              readOnly
              className="bg-transparent text-xl font-medium w-full outline-none focus:outline-none placeholder-gray-400 text-gray-900"
              value={toValue}
            />
            <div
              className="flex items-center cursor-pointer space-x-1"
              onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
            >
              <span className="text-lg font-bold text-gray-900">{toCurrency}</span>
              <span className="text-sm">{currencies.find(c => c.name === toCurrency)?.symbol}</span>
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
            <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
              {currencies.filter(c => c.name !== fromCurrency).map((currency) => (
                <div
                  key={currency.name}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectCurrency(currency.name, 'to')}
                >
                  <span className="mr-3 text-lg">{currency.symbol}</span>
                  <span className="font-medium text-gray-800">{currency.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exchange rate display */}
        <div className="mt-6 text-center text-sm text-gray-500">
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
