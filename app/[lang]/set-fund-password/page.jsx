"use client"
import Button from "@/components/Form/Button";
import FormPassword from "@/components/Form/FormPassword";
import DWStore from "@/store/DWStore";
import { useState } from "react";

function SetFundPassword() {
   const [password, setPassword] = useState("")
   const [error, setError] = useState(false)
   const {SetWithdrawPasswordRequest} = DWStore()

   const handleSubmit= async()=>{
      if(password === ""){
         setError(true)
      }else {
          await SetWithdrawPasswordRequest({password:password})
          setError(false)
          setPassword("")
      }
     
   }
    return ( 
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
               <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Set Password</h2>
            </div>

            <div>
               <div className="grid lg:grid-cols-3 gap-5">
                  <div></div>
                  <div>
                     <FormPassword
                        placeholder="Enter Password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                     />

                     {error && <p className="text-red-500 mt-2">Please insert password</p>}

                     <Button
                     text="Submit"
                     className="w-full mt-5"
                     handleFunc={handleSubmit}
                     />
                  </div>
                  <div></div>
               </div> 
            </div>

            {/* Under Review  */}
            {/* <UnderReview/> */}
        </div>
     );
}

export default SetFundPassword;