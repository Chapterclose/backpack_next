"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import UserStore from "@/store/UserStore";
import { Loader2 } from "lucide-react"; // Import Loader2 for the spinner
import { useState } from "react";

function EmailAuthenticationPage() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [emailError, setEmailError] = useState("")
    const [otpError, setOtpError] = useState("")
    const [sendSuccess, setSendSuccess] = useState(false)
    const [confirmSuccess, setConfirmSuccess] = useState(false)
    const { SendEmailOtpRequest, VerifyOtpRequest, isLoading } = UserStore()

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSendEmail = async () => {
        setEmailError("");
        setSendSuccess(false);
        setOtpError(""); // Clear OTP error as well
        setConfirmSuccess(false); // Clear confirm success

        if (!email.trim()) {
            setEmailError("Email address cannot be empty.");
            return;
        }
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await SendEmailOtpRequest({ email });
            setSendSuccess(true); 
        } catch (error) {
            console.error("Error sending email OTP:", error);
            setEmailError("An error occurred while sending the code. Please try again.");
            setSendSuccess(false); 
        }
    }


    const handleConfirmEmail = async () => {
        setOtpError("");
        setEmailError("");
        setConfirmSuccess(false);
        setSendSuccess(false); 

        if (!email.trim()) {
            setEmailError("Email is required to confirm authentication.");
            return;
        }
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        // 2. Validate OTP
        if (!otp.trim()) {
            setOtpError("Verification code cannot be empty.");
            return;
        }
        if (otp.trim().length !== 6 || !/^\d+$/.test(otp)) {
            setOtpError("Verification code must be 6 digits.");
            return;
        }

        try {
            const response = await VerifyOtpRequest({ email, otp });
            setConfirmSuccess(true); 
            setOtp(""); 
            setEmail("")
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setOtpError("An error occurred during verification. Please try again.");
            setConfirmSuccess(false); 
        }
    }

    return (
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Email Authentication</h2>
            </div>

            <div className="relative"> {/* Added relative positioning for loading overlay */}
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex justify-center items-center z-10 rounded-lg">
                        <Loader2 className="animate-spin h-10 w-10 text-green-500" />
                        <span className="ml-3 text-lg font-medium text-gray-700 dark:text-white">Processing...</span>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-5">
                    <div></div>
                    <div>
                        <FormInput
                            label="Email"
                            placeholder="Please enter"
                            type="email"
                            className=""
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError("");
                                setSendSuccess(false);
                                setConfirmSuccess(false); // Clear confirm success on email change
                            }}
                            disabled={isLoading} // Disable input while loading
                        />
                        {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}
                        {sendSuccess && <p className="text-green-500 text-sm mb-4">Verification code sent!</p>}

                        <div className="relative mb-5">
                            <FormInput
                                label="Verification Code"
                                placeholder="Please enter"
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    setOtpError(""); // Clear error when typing
                                }}
                                disabled={isLoading} // Disable input while loading
                            />
                            <Button
                                text="Send"
                                className="absolute right-2 bottom-[10px] text-xs p-[5_15px]"
                                handleFunc={handleSendEmail}
                                disabled={isLoading} // Disable button while loading
                            />
                        </div>
                        {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}
                        {confirmSuccess && <p className="text-green-500 text-sm mb-4">Email authenticated successfully!</p>}

                        <Button
                            text="Confirm"
                            className="w-full mt-5"
                            handleFunc={handleConfirmEmail}
                            disabled={isLoading} // Disable button while loading
                        />
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default EmailAuthenticationPage;