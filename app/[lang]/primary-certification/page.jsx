import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";

function PrimaryCertificationPage() {
    return ( 
        <div className="container py-[40px] lg:py-[80px]">
            <div className="text-center mb-10">
               <h2 className="text-4xl font-semibold mb-3 text-gray-700 dark:text-white">Primary Certification</h2>
               <p>In order to ensure a safe account experience, please bind your personal identity information</p>
            </div>

            <div>
               <div className="grid lg:grid-cols-3 gap-5">
                  <div></div>
                  <div>
                     <FormInput
                     label="Name"
                     placeholder="Enter Name"
                     className="mb-5"
                     />
                     <FormInput
                     label="ID Number"
                     placeholder="Enter ID Number"
                     className="mb-5"
                     />

                     <Button
                     text="Submit"
                     className="w-full"
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

export default PrimaryCertificationPage;