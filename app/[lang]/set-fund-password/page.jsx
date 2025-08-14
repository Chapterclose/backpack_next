"use client"
import Button from "@/components/Form/Button";
import FormPassword from "@/components/Form/FormPassword";
import DWStore from "@/store/DWStore";
import UserStore from "@/store/UserStore";
import { useState } from "react";
import toast from "react-hot-toast";

function SetFundPassword() {
   const [password, setPassword] = useState("")
   const [error, setError] = useState(false)
   const {SetWithdrawPasswordRequest} = DWStore()
   const {UserData, GetUserInfoRequest, isLoading} = UserStore()

   const handleSubmit= async()=>{
      if(password === ""){
         setError(true)
      }else if(password.length < 6) {
         toast.error("Password Must be minimum 6 characters")
      }else{
         const res = await SetWithdrawPasswordRequest({password:password})
         if(res.status === 200){
            await GetUserInfoRequest({"metamask_id":UserData?.username})
            setError(false)
            setPassword("")
         }
          
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
                        disabled={UserData?.is_already_set_withdraw_password}
                     />

                     {error && <p className="text-red-500 mt-2">Please insert password</p>}

                     <Button
                     text="Submit"
                     className="w-full mt-5"
                     handleFunc={handleSubmit}
                     disabled={UserData?.is_already_set_withdraw_password}
                     />
                  </div>
                  <div></div>
               </div> 

               {UserData?.is_already_set_withdraw_password && <p className="dark:text-white text-center mt-5">To change password contact with <span className="underline text-red-500 cursor-pointer font-semibold">support</span></p>}
            </div>

            {/* Under Review  */}
            {/* <UnderReview/> */}
        </div>
     );
}

export default SetFundPassword;