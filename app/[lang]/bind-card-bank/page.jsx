"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import UserStore from "@/store/UserStore";
import { Banknote, Edit, Loader2 } from "lucide-react"; // Import Loader2 icon for spinner
import { useEffect, useState } from "react";

function BindCardBack() {
    // isAddingOrEditingBankCard now controls showing the form (true) vs. showing bank list (false)
    const [isAddingOrEditingBankCard, setIsAddingOrEditingBankCard] = useState(false)
    // Destructure isLoading directly from UserStore
    const { GetBankInfoRequest, bankInfo, CreateBankAccountRequest, isLoading } = UserStore()

    // Required fields with their states and error states
    const [cardNumber, setCardNumber] = useState("")
    const [cardNumberError, setCardNumberError] = useState("")
    const [affiliatedBank, setAffiliatedBank] = useState("")
    const [affiliatedBankError, setAffiliatedBankError] = useState("")

    // Optional fields with their states
    const [bankBranch, setBankBranch] = useState("")
    const [cardHandlingBankAddress, setCardHandlingBankAddress] = useState("")
    const [bankInternationalCode, setBankInternationalCode] = useState("")
    const [homeAddress, setHomeAddress] = useState("")

    // State for overall form submission success/failure
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // State to hold the bank card being edited, if any
    const [editingBankCard, setEditingBankCard] = useState(null);

    const handleAddBankAccount = async () => {
        // Reset previous errors and submission status
        setCardNumberError("");
        setAffiliatedBankError("");
        setSubmitSuccess(false);
        setSubmitError("");

        let hasError = false;

        // Validate Bank Card Number
        if (!cardNumber.trim()) {
            setCardNumberError("Bank card number cannot be empty.");
            hasError = true;
        } else if (!/^\d{13,19}$/.test(cardNumber.replace(/\s/g, ''))) {
            setCardNumberError("Please enter a valid bank card number (13-19 digits).");
            hasError = true;
        }

        // Validate Affiliated Bank
        if (!affiliatedBank.trim()) {
            setAffiliatedBankError("Affiliated bank cannot be empty.");
            hasError = true;
        }

        if (hasError) {
            return; // Stop if validation fails
        }

        try {
            const payload = {
                card_number: cardNumber.replace(/\s/g, ''),
                bank_name: affiliatedBank,
                bank_branch: bankBranch,
                bank_address: cardHandlingBankAddress,
                bank_international_code: bankInternationalCode,
                home_address: homeAddress,
            };
            
            const response = await CreateBankAccountRequest(payload);
                
                setSubmitSuccess(true);
                setCardNumber("");
                setAffiliatedBank("");
                setBankBranch("");
                setCardHandlingBankAddress("");
                setBankInternationalCode("");
                setHomeAddress("");
                setEditingBankCard(null); 
                await GetBankInfoRequest();
                // Go back to the list view after successful submission
                setIsAddingOrEditingBankCard(false);
        } catch (error) {
            console.error("Error adding/updating bank account:", error);
            setSubmitError("An unexpected error occurred. Please try again later.");
        }
    }

    useEffect(() => {
        GetBankInfoRequest();
    }, [])

    // Function to handle editing an existing bank card
    const handleEditBankCard = (card) => {
        setEditingBankCard(card);
        setCardNumber(card.card_number);
        setAffiliatedBank(card.bank_name);
        setBankBranch(card.bank_branch || "");
        setCardHandlingBankAddress(card.bank_address || "");
        setBankInternationalCode(card.bank_international_code || "");
        setHomeAddress(card.home_address || "");
        setIsAddingOrEditingBankCard(true);
        setSubmitSuccess(false);
        setSubmitError("");
    };

    const handleAddButtonClick = () => {
        setEditingBankCard(null);
        setCardNumber("");
        setAffiliatedBank("");
        setBankBranch("");
        setCardHandlingBankAddress("");
        setBankInternationalCode("");
        setHomeAddress("");
        setIsAddingOrEditingBankCard(true);
        setSubmitSuccess(false);
        setSubmitError("");
    };

    return (
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Bind Bank Card</h2>
            </div>

            <div>
                {isLoading && !isAddingOrEditingBankCard ? (
                    // Only show global loading spinner when not in the form and data is loading
                    <div className="flex justify-center items-center h-[200px] text-green-500">
                        <Loader2 className="animate-spin h-10 w-10 mr-3" />
                        <span className="text-lg">Loading bank data...</span>
                    </div>
                ) : isAddingOrEditingBankCard ? (
                    // Form for adding/editing bank card
                    <div className="grid lg:grid-cols-3 gap-5">
                        <div></div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-5 dark:text-white text-gray-700">
                                {editingBankCard ? "Edit Bank Card" : "Add New Bank Card"}
                            </h3>
                            <FormInput
                                label="Bank card number"
                                placeholder="Enter bank card number"
                                className="mb-0"
                                value={cardNumber}
                                onChange={(e) => {
                                    setCardNumber(e.target.value);
                                    setCardNumberError("");
                                    setSubmitError("");
                                }}
                            />
                            {cardNumberError && <p className="text-red-500 text-sm mt-1 mb-4">{cardNumberError}</p>}

                            <FormInput
                                label="Affiliated bank"
                                placeholder="Enter affiliated bank"
                                className="mb-0"
                                value={affiliatedBank}
                                onChange={(e) => {
                                    setAffiliatedBank(e.target.value);
                                    setAffiliatedBankError("");
                                    setSubmitError("");
                                }}
                            />
                            {affiliatedBankError && <p className="text-red-500 text-sm mt-1 mb-4">{affiliatedBankError}</p>}

                            <FormInput
                                label="Bank branch (Optional)"
                                placeholder="Please Enter"
                                className="mb-5"
                                value={bankBranch}
                                onChange={(e) => setBankBranch(e.target.value)}
                            />
                            <FormInput
                                label="Card handling bank address or number (optional)"
                                placeholder="Please Enter"
                                className="mb-5"
                                value={cardHandlingBankAddress}
                                onChange={(e) => setCardHandlingBankAddress(e.target.value)}
                            />
                            <FormInput
                                label="Bank international code (optional)"
                                placeholder="Please Enter"
                                className="mb-5"
                                value={bankInternationalCode}
                                onChange={(e) => setBankInternationalCode(e.target.value)}
                            />
                            <FormInput
                                label="Home address (optional)"
                                placeholder="Please Enter"
                                className="mb-5"
                                value={homeAddress}
                                onChange={(e) => setHomeAddress(e.target.value)}
                            />

                            {submitError && <p className="text-red-500 text-sm mt-1 mb-4 text-center">{submitError}</p>}
                            {submitSuccess && <p className="text-green-500 text-sm mt-1 mb-4 text-center">Bank account operation successful!</p>}

                            <Button
                                text={editingBankCard ? "Update Bank Card" : "Submit"}
                                className="w-full"
                                handleFunc={handleAddBankAccount}
                                disabled={isLoading} 
                            />
                            <Button
                                text="Cancel"
                                className="w-full mt-3 bg-gray-500 hover:bg-gray-600"
                                handleFunc={() => setIsAddingOrEditingBankCard(false)}
                                disabled={isLoading}
                            />
                        </div>
                        <div></div>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto">
                        {bankInfo && Array.isArray(bankInfo) && bankInfo.length > 0 ? (
                            bankInfo.map((card, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 dark:text-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xl font-semibold flex items-center gap-x-2">
                                            {card.name || 'Account Holder'} <span className="text-sm text-gray-400">({card.card_number.slice(-4)})</span>
                                        </h4>
                                        <button onClick={() => handleEditBankCard(card)} className="text-green-400 hover:text-green-500">
                                            <Edit size={20} />
                                        </button>
                                    </div>
                                    <p className="text-lg font-medium">{card.bank_name}</p>
                                    <p className="text-gray-400 text-sm">{card.bank_branch ? `Branch: ${card.bank_branch}` : ''}</p>
                                    <p className="text-gray-400 text-sm">{card.bank_address ? `Address: ${card.bank_address}` : ''}</p>
                                    <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-3">
                                        <p className="text-sm text-gray-300">Account: {card.card_number}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center">
                                <Banknote className="w-[150px] h-[150px] mx-auto mt-[100px] text-green-500" />
                                <h4 className="text-gray-700 dark:text-white text-xl mb-8">Unbound Bank Card</h4>
                            </div>
                        )}

                        <Button
                            text={bankInfo && Array.isArray(bankInfo) && bankInfo.length > 0 ? "+ Add New Bank Card" : "Add Bank Card"}
                            handleFunc={handleAddButtonClick}
                            className="w-full mt-5"
                            disabled={isLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default BindCardBack;