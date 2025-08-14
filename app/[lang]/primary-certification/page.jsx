"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import UserStore from "@/store/UserStore";
import { CheckCircle, Loader2 } from "lucide-react"; // Import Loader2
import { useState } from "react";
import toast from "react-hot-toast";

function PrimaryCertificationPage() {
    const [name, setName] = useState("")
    const [idNumber, setIdNumber] = useState("")
    const [nameError, setNameError] = useState("")
    const [idNumberError, setIdNumberError] = useState("")
    // Destructure isLoading from UserStore
    const { PrimaryCertificationRequest, UserData, isLoading, UserLoginRequest } = UserStore()
    const handleSubmit = async () => {
        // Reset previous errors
        setNameError("");
        setIdNumberError("");

        let hasError = false;

        // Validate Name
        if (!name.trim()) {
            setNameError("Please enter your name.");
            hasError = true;
        }

        // Validate ID Number
        if (!idNumber.trim()) {
            setIdNumberError("Please enter your ID Number.");
            hasError = true;
        } else if (!/^\d+$/.test(idNumber)) {
            setIdNumberError("ID Number should contain only digits.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const res = await PrimaryCertificationRequest({ name, id_number: parseFloat(idNumber) });

        if(res === 200) {
            await UserLoginRequest({"metamask_id":`${UserData.username}`})
        }else if(res === 401){
            toast.error("Try Again!")
        }

        setName("");
        setIdNumber("");
    }

    return (
        <div className="container py-[40px] lg:py-[80px]">
            {isLoading ? (
                <div className="flex justify-center items-center h-[200px] text-green-500">
                    <Loader2 className="animate-spin h-10 w-10 mr-3" />
                    <span className="text-lg">Processing certification...</span>
                </div>
            ) : UserData?.id_number !== null ? (
                <div className="text-center shadow-lg p-5">
                    <CheckCircle className="text-green-500 mx-auto w-14 h-14" />
                    <h3 className="text-green-500 font-semibold text-2xl mt-3">Certification Successful!</h3>
                </div>
            ) : (
                // Show the certification form
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Primary Certification</h2>
                        <p className="dark:text-white">In order to ensure a safe account experience, please bind your personal identity information.</p>
                    </div>

                    <div>
                        <div className="grid lg:grid-cols-3 gap-5">
                            <div></div>
                            <div>
                                <FormInput
                                    label="Name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setNameError(""); // Clear error when typing
                                    }}
                                />
                                {nameError && <p className="text-red-500 text-sm mb-2">{nameError}</p>}

                                <FormInput
                                    label="ID Number"
                                    placeholder="Enter ID Number"
                                    value={idNumber}
                                    onChange={(e) => {
                                        setIdNumber(e.target.value);
                                        setIdNumberError(""); // Clear error when typing
                                    }}
                                />
                                {idNumberError && <p className="text-red-500 text-sm mb-3">{idNumberError}</p>}

                                <Button
                                    text="Submit"
                                    className="w-full"
                                    handleFunc={handleSubmit}
                                    disabled={isLoading} 
                                />
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PrimaryCertificationPage;