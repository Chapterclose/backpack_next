"use client";

import VerificationModal from "@/components/Bank/VerificationModal";
import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import UserStore from "@/store/UserStore";
import cardValidator from "card-validator";
import { Banknote, Edit, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function BindCardBack() {
  const [isAddingOrEditingBankCard, setIsAddingOrEditingBankCard] = useState(false);
  const {
    GetBankInfoRequest,
    bankInfo,
    CreateBankAccountRequest,
    isLoading,
    BankAccountEditRequest,
    BankAccountDeleteRequest,
  } = UserStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationDateError, setExpirationDateError] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [securityCodeError, setSecurityCodeError] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [nameOnCardError, setNameOnCardError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingBankCard, setEditingBankCard] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleAddBankAccount = async () => {
    setCardNumberError("");
    setExpirationDateError("");
    setSecurityCodeError("");
    setNameOnCardError("");
    setSubmitSuccess(false);
    setSubmitError("");

    let hasError = false;
    const rawCardNumber = cardNumber.replace(/\s/g, "");
    const rawSecurityCode = securityCode.trim();
    const rawNameOnCard = nameOnCard.trim();
    const rawExpirationDate = expirationDate.trim();

    const numberValidation = cardValidator.number(rawCardNumber);
    if (!rawCardNumber) {
      setCardNumberError("Card number cannot be empty.");
      hasError = true;
    } else if (!numberValidation.isValid) {
      setCardNumberError("Please enter a valid card number.");
      hasError = true;
    }

    const expirationValidation = cardValidator.expirationDate(rawExpirationDate);
    if (!rawExpirationDate) {
      setExpirationDateError("Expiration date cannot be empty.");
      hasError = true;
    } else if (!expirationValidation.isValid) {
      setExpirationDateError("Please enter a valid format (MM/YYYY).");
      hasError = true;
    }

    const cvvValidation = cardValidator.cvv(rawSecurityCode);
    if (!rawSecurityCode) {
      setSecurityCodeError("Security code cannot be empty.");
      hasError = true;
    } else if (!cvvValidation.isValid) {
      setSecurityCodeError("Please enter a valid security code.");
      hasError = true;
    }

    if (!rawNameOnCard) {
      setNameOnCardError("Name on card cannot be empty.");
      hasError = true;
    }

    if (hasError) return;

    try {
      // ✅ New payload structure
      const payload = {
        card_number: rawCardNumber,
        expiration_date: rawExpirationDate,
        security_code: rawSecurityCode,
        cardholder_name: rawNameOnCard,
      };

      if (!editingBankCard) {
        await CreateBankAccountRequest(payload);
      } else {
        await BankAccountEditRequest(payload, editId);
      }
      
      setIsVerificationModalOpen(true);
    } catch (error) {
      console.error("Error adding/updating bank account:", error);
      setSubmitError("An unexpected error occurred. Please try again later.");
      toast.error("Operation failed.");
    }
  };

  const handleVerificationSuccess = async () => {
    setIsVerificationModalOpen(false);
    setIsAddingOrEditingBankCard(false);
    setEditingBankCard(null);
    setCardNumber("");
    setExpirationDate("");
    setSecurityCode("");
    setNameOnCard("");
    setSubmitSuccess(false);
    
    try {
      await GetBankInfoRequest();
    } catch (error) {
      console.error("Error fetching bank info:", error);
    }
    
    window.scrollTo({ top: 0 });
    toast.success(editingBankCard ? "Card update successful!" : "Card binding successful!");
  };

  useEffect(() => {
    GetBankInfoRequest();
  }, []);

  const handleEditBankCard = (card) => {
    setEditId(card.id);
    setEditingBankCard(card);

    // ✅ Updated mapping
    setCardNumber(card.card_number || "");
    setExpirationDate(card.expiration_date || "");
    setSecurityCode(card.security_code || "");
    setNameOnCard(card.cardholder_name || "");

    setIsAddingOrEditingBankCard(true);
    setSubmitSuccess(false);
    setSubmitError("");
  };

  const handleAddButtonClick = () => {
    setEditingBankCard(null);
    setCardNumber("");
    setExpirationDate("");
    setSecurityCode("");
    setNameOnCard("");
    setIsAddingOrEditingBankCard(true);
    setSubmitSuccess(false);
    setSubmitError("");
  };

  // Delete
  const handleDeleteBankCard = async (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      const res = await BankAccountDeleteRequest(id);
      if (res.status === 200) {
        // toast.success("Card deleted successfully.");
        await GetBankInfoRequest();
      } else {
        toast.error("Failed to delete card.");
      }
    } else {
      toast.error("Deletion cancelled.");
    }
  };

  return (
    <div className="container py-[40px] lg:py-[80px]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">
          Bind Payment Card
        </h2>
      </div>

      <div>
        {isLoading && !isAddingOrEditingBankCard ? (
          <div className="flex justify-center items-center h-[200px] text-green-500">
            <Loader2 className="animate-spin h-10 w-10 mr-3" />
            <span className="text-lg">Loading card data...</span>
          </div>
        ) : isAddingOrEditingBankCard ? (
          <div className="grid lg:grid-cols-3 gap-5">
            <div></div>
            <div>
              <h3 className="text-2xl font-semibold mb-5 dark:text-white text-gray-700">
                {editingBankCard ? "Edit Payment Card" : "Add New Payment Card"}
              </h3>

              <FormInput
                label="Card number"
                placeholder="0000 0000 0000 0000"
                className="mb-0"
                value={cardNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/\s/g, "").slice(0, 16);
                  const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
                  setCardNumber(formattedValue);
                  setCardNumberError("");
                  setSubmitError("");
                }}
                maxLength={19}
              />
              {cardNumberError && (
                <p className="text-red-500 text-sm mt-1 mb-4">{cardNumberError}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Expiration date"
                    placeholder="MM/YYYY"
                    className="mb-0"
                    value={expirationDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length > 2) {
                        value = `${value.substring(0, 2)}/${value.substring(2, 6)}`;
                      }
                      setExpirationDate(value.substring(0, 7));
                      setExpirationDateError("");
                      setSubmitError("");
                    }}
                    maxLength={7}
                  />
                  {expirationDateError && (
                    <p className="text-red-500 text-sm mt-1 mb-4">{expirationDateError}</p>
                  )}
                </div>

                <div>
                  <FormInput
                    label="Security code"
                    placeholder="CVV/CVC"
                    className="mb-0"
                    value={securityCode}
                    onChange={(e) => {
                      setSecurityCode(e.target.value.replace(/\D/g, ""));
                      setSecurityCodeError("");
                      setSubmitError("");
                    }}
                    maxLength={3}
                  />
                  {securityCodeError && (
                    <p className="text-red-500 text-sm mt-1 mb-4">{securityCodeError}</p>
                  )}
                </div>
              </div>

              <FormInput
                label="Name on card"
                placeholder="Name and surname"
                className="mb-5"
                value={nameOnCard}
                onChange={(e) => {
                  setNameOnCard(e.target.value);
                  setNameOnCardError("");
                  setSubmitError("");
                }}
              />
              {nameOnCardError && (
                <p className="text-red-500 text-sm mt-1 mb-4">{nameOnCardError}</p>
              )}

              {submitError && (
                <p className="text-red-500 text-sm mt-1 mb-4 text-center">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="text-green-500 text-sm mt-1 mb-4 text-center">
                  Card operation successful!
                </p>
              )}

              <Button
                text={editingBankCard ? "Update Card" : "Submit"}
                className="w-full"
                handleFunc={handleAddBankAccount}
                disabled={isLoading}
              />
              <Button
                text="Cancel"
                className="w-full mt-3 bg-gray-500 hover:bg-gray-600"
                handleFunc={() => {
                  setIsAddingOrEditingBankCard(false);
                  setEditingBankCard(null);
                }}
                disabled={isLoading}
              />
            </div>
            <div></div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            {bankInfo && Array.isArray(bankInfo) && bankInfo.length > 0 ? (
              bankInfo.map((card, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 dark:text-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-semibold flex items-center gap-x-2">
                      {card.cardholder_name || "Card Holder"}{" "}
                      <span className="text-sm text-gray-400">({card.card_number?.slice(-4)})</span>
                    </h4>
                    <div>
                      <button
                        onClick={() => handleEditBankCard(card)}
                        className="text-green-400 hover:text-green-500 mr-3 cursor-pointer"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBankCard(card?.id)}
                        className="text-red-400 hover:text-red-500 cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {card.expiration_date ? `Expires: ${card.expiration_date}` : ""}
                    {card.security_code ? ` | CVV: ${card.security_code}` : ""}
                  </p>
                  <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-3">
                    <p className="text-sm text-gray-300">Card Number: {card.card_number}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <Banknote className="w-[150px] h-[150px] mx-auto mt-[100px] text-green-500" />
                <h4 className="text-gray-700 dark:text-white text-xl mb-8">
                  No Payment Cards Bound
                </h4>
              </div>
            )}

            <Button
              text={
                bankInfo && Array.isArray(bankInfo) && bankInfo.length > 0
                  ? "+ Add New Card"
                  : "Add Card"
              }
              handleFunc={handleAddButtonClick}
              className="w-full mt-5"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationSuccess}
      />
    </div>
  );
}

export default BindCardBack;
