"use client";
import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

// Define the localStorage key
const LOCAL_STORAGE_KEY = "realNameAuthStatus";

function RealNameAuthentication() {
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [selectedIdCardType, setSelectedIdCardType] = useState("NID Number");
  const [selectedCountry, setSelectedCountry] = useState("Japan");
  const [isIdCardDropdownOpen, setIsIdCardDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize isUnderReview to false. We will read from localStorage in useEffect.
  const [isUnderReview, setIsUnderReview] = useState(false);
  // Add a state to track if the component has mounted
  const [mounted, setMounted] = useState(false);

  const lendingProducts = ["NID Number", "Passport", "VISA"];
  const countryArr = ["USA", "United Arab Emirates", "Nepal", "Bangladesh", "Japan"];

  // Use useEffect to read from localStorage only after the component has mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStatus = localStorage.getItem(LOCAL_STORAGE_KEY);
      setIsUnderReview(storedStatus === "true");
      setMounted(true); // Mark component as mounted
    }
  }, []); // Empty dependency array means this runs once on mount

  // Use useEffect to save isUnderReview to localStorage whenever it changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") { // Only save if mounted
      localStorage.setItem(LOCAL_STORAGE_KEY, isUnderReview.toString());
    }
  }, [isUnderReview, mounted]); // Add mounted to dependency array

  // Handles the click for the ID card dropdown
  const handleIdCardDropdownClick = () => {
    setIsIdCardDropdownOpen(!isIdCardDropdownOpen);
    setIsCountryDropdownOpen(false); // Close other dropdown
  };

  // Handles the click for the country dropdown
  const handleCountryDropdownClick = () => {
    setIsCountryDropdownOpen(!isCountryDropdownOpen);
    setIsIdCardDropdownOpen(false); // Close other dropdown
  };

  const handleIdCardSelect = (product) => {
    setSelectedIdCardType(product);
    setIsIdCardDropdownOpen(false);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Reset messages
    setFormError("");
    setSuccessMessage("");

    // Validation check
    if (
      !name ||
      !idNumber ||
      !selectedIdCardType ||
      !selectedCountry ||
      !frontImage ||
      !backImage
    ) {
      setFormError("Please fill in all the required fields and upload both ID photos.");
      return;
    }

    toast.success("Authentication submitted successfully!");
    setName("");
    setIdNumber("");
    setSelectedCountry("Japan");
    setSelectedIdCardType("NID Number");
    setBackImage(null);
    setFrontImage(null);

    // Resetting the file input values
    const frontInput = document.getElementById("front-upload");
    if (frontInput) {
      frontInput.value = "";
    }
    const backInput = document.getElementById("back-upload");
    if (backInput) {
      backInput.value = "";
    }

    // Set the under review state to true, which will also trigger useEffect to save to localStorage
    setIsUnderReview(true);
    window.scrollTo({ top: 0 });
  };

  // Conditional rendering based on `mounted` to prevent hydration mismatch for the initial render
  if (!mounted) {
    return (
      <div className="container py-[40px] lg:py-[80px] dark:bg-gray-900 dark:text-white min-h-screen">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-4xl font-semibold mb-3 dark:text-gray-100">
            Real-name Authentication
          </h2>
          {/* Optionally, you can show a loading spinner or placeholder here */}
          <p className="text-gray-400">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-[40px] lg:py-[80px] dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-4xl font-semibold mb-3 dark:text-gray-100">
          Real-name Authentication
        </h2>
        {!isUnderReview && <p className="text-red-400">
          In order to ensure a safe account experience, please bind your personal identity
          information.
        </p>}
      </div>

      {isUnderReview ? (
        // Content to show when under review
        <div className="max-w-xl mx-auto text-center py-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500"/>
          </div>
          <p className="text-2xl font-semibold dark:text-gray-100">Under review</p>
        </div>
      ) : (
        // Original form content
        <div className="max-w-xl mx-auto">
          {formError && (
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              {formError}
            </div>
          )}
          {successMessage && (
            <div
              className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
              role="alert"
            >
              {successMessage}
            </div>
          )}

          <FormInput
            label={"Name"}
            placeholder={"Please enter"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ID Card Dropdown */}
          <div className="mb-5 relative">
            <label className="text-lg font-medium dark:text-gray-100 mb-2 block">ID Card</label>
            <div
              className={twMerge(
                "w-full px-3 py-3 border border-gray-600 rounded-md shadow-sm cursor-pointer flex justify-between items-center",
                "focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500",
                "dark:bg-gray-800 dark:text-white"
              )}
              onClick={handleIdCardDropdownClick}
            >
              <span>{selectedIdCardType}</span>
              <span>{isIdCardDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {isIdCardDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-600">
                <ul className="py-1">
                  {lendingProducts.map((product) => (
                    <li
                      key={product}
                      className="block px-4 py-2 text-sm dark:text-gray-100 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleIdCardSelect(product)}
                    >
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <FormInput
            label={"ID Number"}
            placeholder={"Please fill in the ID number"}
            type={"number"}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />

          {/* Country Dropdown */}
          <div className="mb-5 relative">
            <label className="text-lg font-medium dark:text-gray-100 mb-2 block">Country</label>
            <div
              className={twMerge(
                "w-full px-3 py-3 border border-gray-600 rounded-md shadow-sm cursor-pointer flex justify-between items-center",
                "focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500",
                "dark:bg-gray-800 dark:text-white"
              )}
              onClick={handleCountryDropdownClick}
            >
              <span>{selectedCountry}</span>
              <span>{isCountryDropdownOpen ? "▲" : "▼"}</span>
            </div>
            {isCountryDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-600">
                <ul className="py-1">
                  {countryArr.map((country) => (
                    <li
                      key={country}
                      className="block px-4 py-2 text-sm dark:text-gray-100 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ID Photo Upload Section */}
          <div className="mb-5">
            <p className="text-lg font-medium dark:text-gray-100 mb-2 block">
              ID photo{" "}
              <span className="text-red-400 text-sm">
                (Please ensure that the ID photo is clearly visible)
              </span>
            </p>

            {/* Front Side Upload */}
            <div className="mb-5">
              <label
                htmlFor="front-upload"
                className="block w-full h-48 border-2 border-dashed rounded-md border-gray-600 cursor-pointer flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden"
              >
                {frontImage ? (
                  <img
                    src={frontImage}
                    alt="ID Front Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="mt-2 text-sm text-gray-400">Upload the front side</span>
                  </>
                )}
              </label>
              <input
                id="front-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setFrontImage)}
              />
            </div>

            {/* Back Side Upload */}
            <div className="mb-5">
              <label
                htmlFor="back-upload"
                className="block w-full h-48 border-2 border-dashed rounded-md border-gray-600 cursor-pointer flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden"
              >
                {backImage ? (
                  <img
                    src={backImage}
                    alt="ID Back Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="mt-2 text-sm text-gray-400">Upload the reverse side</span>
                  </>
                )}
              </label>
              <input
                id="back-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setBackImage)}
              />
            </div>
          </div>

          <Button text={"Submit"} className={"w-full mt-8"} handleFunc={handleSubmit} />
        </div>
      )}
    </div>
  );
}

export default RealNameAuthentication;