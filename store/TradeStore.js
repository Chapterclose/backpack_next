import api from "@/lib/utils";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { create } from "zustand";


const TradeStore = create((set)=>({
    isLoading: false,
    TradeBuySellRequest:async(body)=>{
            try{
                set({isLoading:true})
                let res=await api.post('/trade/buy-sell/',body,{
                    headers:{
                        "AUTHORIZATION":`Bearer ${Cookies.get('access')}`,
                        'Content-Type': 'application/json'
                    }
                })
                console.log(res)
                toast.success(res.data['message'])
            }catch(e){
                console.log(e)
            }finally {
                set({isLoading:false})
            }
        },
}))


export default TradeStore;