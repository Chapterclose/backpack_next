"use client"

import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

// Local Button component to resolve import error
const Button = ({ text, className, handleFunc }) => {
  return (
    <button
      onClick={handleFunc}
      className={`bg-primary-200 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-primary-300 transition-colors duration-200 ${className}`}
    >
      {text}
    </button>
  );
};

// Local Heading component to resolve import error
const Heading = ({ text }) => {
  return (
    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
      {text}
    </h1>
  );
};

const TransferPage = () => {
  const [fromAsset, setFromAsset] = useState('Wealth management assets');
  const [toAsset, setToAsset] = useState('total assets');
  const [transferAmount, setTransferAmount] = useState('');
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  // New state for the success message
  const [successMessage, setSuccessMessage] = useState('');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both dropdowns
      if (isFromDropdownOpen && !event.target.closest('.from-dropdown-container')) {
        setIsFromDropdownOpen(false);
      }
      if (isToDropdownOpen && !event.target.closest('.to-dropdown-container')) {
        setIsToDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFromDropdownOpen, isToDropdownOpen]);

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
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    // Clear any success message on swap
    setSuccessMessage('');
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
    // Clear any success message on asset change
    setSuccessMessage('');
  };

  // Function to set the transfer amount to the available balance
  const handleMaxClick = () => {
    const balanceString = availableBalances[fromAsset].split(' ')[0].replace(/,/g, '');
    setTransferAmount(balanceString);
    // Clear any success message on Max click
    setSuccessMessage('');
  };

  // New function to handle the "Confirm Transfer" button click
  const handleConfirmTransfer = () => {
    const amount = parseFloat(transferAmount);
    // Basic validation: check if amount is a positive number
    if (isNaN(amount) || amount <= 0) {
      setSuccessMessage('Please enter a valid amount to transfer.');
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    // Simulate a successful transfer
    console.log(`Transferring ${transferAmount} from ${fromAsset} to ${toAsset}`);
    setSuccessMessage('Transfer completed successfully!');
    setTransferAmount(''); // Clear the input field after successful transfer

    // Automatically hide the message after a few seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 dark:bg-dark py-10 px-5 font-inter">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <Heading text={"Transfer"} />

        {/* From and To asset selection section with swap icon on the right */}
        <div className="relative flex items-center space-x-4 mb-6">
          {/* Container for From and To dropdowns */}
          <div className="flex-grow bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600">
            {/* From asset dropdown */}
            <div className="relative from-dropdown-container">
              <div
                className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
                onClick={() => setIsFromDropdownOpen(!isFromDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">From</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 dark:text-white font-medium capitalize">{fromAsset}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${isFromDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </div>
              </div>
              {/* From dropdown menu */}
              {isFromDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
                  {assetTypes.filter(asset => asset !== toAsset).map((asset) => (
                    <div
                      key={asset}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSelectAsset(asset, 'from')}
                    >
                      <span className="font-medium text-gray-800 dark:text-white capitalize">{asset}</span>
                      {fromAsset === asset && <Check className="w-5 h-5 text-primary-200" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* To asset dropdown */}
            <div className="relative to-dropdown-container">
              <div
                className="flex items-center justify-between pt-2 cursor-pointer"
                onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
              >
                <span className="text-sm font-medium text-gray-500">to</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs md:text-base text-gray-800 dark:text-white font-medium capitalize">{toAsset}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${isToDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </div>
              </div>
              {/* To dropdown menu */}
              {isToDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
                  {assetTypes.filter(asset => asset !== fromAsset).map((asset) => (
                    <div
                      key={asset}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleSelectAsset(asset, 'to')}
                    >
                      <span className="font-medium text-gray-800 dark:text-white capitalize">{asset}</span>
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
          <p className="text-sm font-medium dark:text-white text-gray-500 mb-2">Transfer amount</p>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3 shadow-inner border border-gray-200 dark:border-gray-600">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-xl font-bold w-full outline-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
              value={transferAmount}
              onChange={(e) => {
                setTransferAmount(e.target.value);
                setSuccessMessage(''); // Clear the message when user starts typing again
              }}
            />
            <div className="flex items-center space-x-2">
              <button
                className="text-sm font-bold text-primary-200 uppercase"
                onClick={handleMaxClick}
              >
                Max
              </button>
              <span className="text-sm text-gray-500">|</span>
              <span className="text-base font-bold text-gray-800 dark:text-white">USDT</span>
            </div>
          </div>
        </div>

        {/* Available balance display */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Available balance: <span className="font-bold text-gray-800 dark:text-white">{availableBalances[fromAsset]}</span>
        </div>

        {/* Conditional Success/Error Message Display */}
        {successMessage && (
          <div
            className={`mt-4 p-3 text-center text-sm font-medium rounded-lg ${
              successMessage.includes('successfully') ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Confirm button */}
        <div className="mt-8">
            <Button
            text={"Confirm Transfer"}
            className={"w-full text-black"}
            handleFunc={handleConfirmTransfer}
            />
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
