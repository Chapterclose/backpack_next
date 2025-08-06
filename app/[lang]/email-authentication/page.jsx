import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";

function EmailAuthenticationPage() {
    return ( 
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
               <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Email Authenticaiton</h2>
            </div>

            <div>
               <div className="grid lg:grid-cols-3 gap-5">
                  <div></div>
                  <div>
                     <FormInput
                     label="Email"
                     placeholder="Please enter"
                     type="email"
                     className="mb-5"
                     />
                     <div className="relative">
                        <FormInput
                        label="Verification Code"
                        placeholder="Please enter"
                        type="code"
                        />
                        <Button text="Send" className="absolute right-2 bottom-[10px] text-xs p-[5_15px]" />
                     </div>

                     <Button
                     text="Confirm"
                     className="w-full mt-5"
                     />
                  </div>
                  <div></div>
               </div> 
            </div>

        </div>
     );
}

export default EmailAuthenticationPage;