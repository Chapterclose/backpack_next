import Button from "@/components/Form/Button";
import FormPassword from "@/components/Form/FormPassword";

function SetFundPassword() {
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
                     />

                     <Button
                     text="Submit"
                     className="w-full mt-5"
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