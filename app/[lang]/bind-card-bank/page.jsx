"use client"

import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import { Banknote } from "lucide-react";
import { useState } from "react";

function BindCardBack() {
   const [isBankCard, setIsBankCard] = useState(false)
    return ( 
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
               <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Bind Bank Card</h2>
            </div>

            <div>
               {isBankCard ?<div className="grid lg:grid-cols-3 gap-5">
                  <div></div>
                  <div>
                     <FormInput
                     label="Bank card number"
                     placeholder="Enter bank card number"
                     className="mb-5"
                     />
                     <FormInput
                     label="Affiliated bank"
                     placeholder="Enter affiliated bank number"
                     className="mb-5"
                     />
                     <FormInput
                     label="Bank branch (Optional)"
                     placeholder="Please Enter"
                     className="mb-5"
                     />
                     <FormInput
                     label="Card handling bank address or number (optional)"
                     placeholder="Please Enter"
                     className="mb-5"
                     />
                     <FormInput
                     label="Bank international code (optional)"
                     placeholder="Please Enter"
                     className="mb-5"
                     />
                     <FormInput
                     label="Home address (optional)"
                     placeholder="Please Enter"
                     className="mb-5"
                     />

                     <Button
                     text="Submit"
                     className="w-full"
                     />
                  </div>
                  <div></div>
               </div> :
               <div className="text-center">
                  <Banknote className="w-[150px] h-[150px] mx-auto mt-[100px] text-green-500"/>
                  <h4 className="text-gray-700 dark:text-white text-xl mb-8">Unbound Bank Card</h4>
                  <Button
                  text="Add Bank Card"
                  handleFunc={()=>setIsBankCard(true)}
                  />
               </div>
               }
            </div>

            {/* Under Review  */}
            {/* <UnderReview/> */}
        </div>
     );
}

export default BindCardBack;