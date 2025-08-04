"use client"

import Button from '@/components/Form/Button';
import FormInput from '@/components/Form/FormInput';
import { useState } from 'react';

const LoanPage = () => {
  // State for the lending products dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("1000-100000 USDT");

  const lendingProducts = [
    "1000-100000 USDT",
    "500-50000 USDT",
    "2000-200000 USDT",
  ];

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 py-10 px-5 font-inter">
      <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Assistance Loan</h1>

        <p className="mb-5 text-xs text-red-500">
          After review by the platform, you can apply for a loan from the platform!
        </p>

        {/* Lending Products Dropdown */}
        <div className="mb-5 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lending Products</label>
          <div
            className="flex items-center justify-between mt-1 w-full rounded-md border border-gray-900 shadow-sm sm:text-sm px-3 h-14 cursor-pointer"
            onClick={handleDropdownClick}
          >
            <span className="text-gray-900">{selectedProduct}</span>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
              <ul className="py-1">
                {lendingProducts.map((product) => (
                  <li
                    key={product}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Other form inputs and details */}
        <FormInput
          label={"Loan amount (USDT)"}
          className={"mb-5"}
          placeholder="Enter loan amount"
          type="number"
        />
        <FormInput
          label={"Repayment cycle"}
          className={"mb-5"}
          value={"7"}
          disabled={true}
        />

        <div className="mb-5 border-t border-gray-200 pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Daily interest rate</span>
            <span className="text-sm font-semibold text-gray-900">0.16%</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Interest</span>
            <span className="text-sm font-semibold text-gray-900">0 USDT</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Repayment method</span>
            <span className="text-sm font-semibold text-right text-gray-900">Repay principal and interest once upon expiration</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Lending institutions</span>
            <span className="text-sm font-semibold text-gray-900">Binance</span>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID photo <span className="text-xs text-gray-400">(Please ensure that the ID photo is clearly visible)</span>
          </label>
          <div className="space-y-4">
            {/* Upload box for the front side */}
            <div className="flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label htmlFor="upload-front" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <input id="upload-front" type="file" className="hidden" accept="image/*" />
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <p className="text-sm text-gray-500 mt-1">Upload the front side</p>
              </label>
            </div>
            {/* Upload box for the reverse side */}
            <div className="flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label htmlFor="upload-reverse" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <input id="upload-reverse" type="file" className="hidden" accept="image/*" />
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <p className="text-sm text-gray-500 mt-1">Upload the reverse side</p>
              </label>
            </div>
            {/* Upload box for the handheld photo */}
            <div className="flex justify-center items-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <label htmlFor="upload-handheld" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <input id="upload-handheld" type="file" className="hidden" accept="image/*" />
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <p className="text-sm text-gray-500 mt-1">Upload a handheld ID photo</p>
              </label>
            </div>
          </div>
        </div>


        {/* Button  */}
        <Button
        text={"Confirm Upload"}
        className={"w-full mt-10"}
        />
      </div>
    </div>
  );
};

export default LoanPage;
