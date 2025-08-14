import api from "@/lib/utils";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const DWStore = create(
  persist(
    (set) => ({
        isLoading: false,
        rechargeAddress:null,
        GeRechargeAddressRequest:async()=>{
                try{
                    set({isLoading:true})
                    let res=await api.get('/trade/recharge-address/')
                    set({rechargeAddress:res.data['recharge_address']})
                }catch(e){
                    console.log(e)
                }finally {
                    set({isLoading:false})
                }
            },
        RechargeDepositRequest:async(body)=>{
                try{
                    set({isLoading:true})
                    let res=await api.post('/trade/recharge-deposit/', body)
                    toast.success(res.data['message'])
                }catch(e){
                    console.log(e)
                }finally {
                    set({isLoading:false})
                }
            },


        depositHistory: null,
        DepositHistoryRequest:async()=>{
                try{
                    set({isLoading:true})
                    let res=await api.get('/trade/deposit-history/')
                    set({depositHistory:res.data.deposit})
                }catch(e){
                    console.log(e)
                }finally {
                    set({isLoading:false})
                }
            },


            // WithDraw api Start
        
            SetWithdrawPasswordRequest:async(body)=>{
                try{
                    set({isLoading:true})
                    let res=await api.post('/trade/set-withdraw-password/', body)
                    toast.success(res.data['message'])
                    return res
                }catch(e){
                    console.log(e)
                }finally {
                    set({isLoading:false})
                }
            },


          WithdrawRequestApi:async(body)=>{
                try{
                    set({isLoading:true})
                    let res=await api.post('/trade/withdraw-request/', body)
                    toast.success(res.data['message'])
                    return res
                }catch(e){
                    console.log(e)
                    return e
                }finally {
                    set({isLoading:false})
                }
            },

          withdrawHistory: null,
          withdrawHistoryRequest:async()=>{
                  try{
                      set({isLoading:true})
                      let res=await api.get('/trade/withdraw-history/')
                      set({withdrawHistory:res.data.withdraw})
                  }catch(e){
                      console.log(e)
                  }finally {
                      set({isLoading:false})
                  }
              },
    }),
    {
      name: "dw-store",
      partialize: (state) => ({
        rechargeAddress: state.rechargeAddress,
        depositHistory: state.depositHistory,
        withdrawHistory: state.withdrawHistory,
      }),
    }
  )
)

export default DWStore;