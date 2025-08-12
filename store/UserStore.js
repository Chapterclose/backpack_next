import api from "@/lib/utils";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from 'zustand/middleware';



const UserStore = create(
  persist(
    (set) => ({
      isUserLogin:false,
        UserData:null,
        UserLoginRequest:async(body)=>{
            try{
                set({isUserLogin:true})
                let res=await api.post('/auth/connect_metamask/',body)
                Cookies.set("access", res.data?.access,{ expires: 7 })
                set({UserData:res.data['customer']})
            }catch(e){
                console.log(e)
            }finally {
                set({isUserLogin:false})
            }
        },
        PrimaryCertificationRequest:async(body)=>{
            try{
                set({isUserLogin:true})
                let res=await api.post('/auth/primary-certificate/',body)
                console.log(res)
            }catch(e){
                console.log(e)
            }finally {
                set({isUserLogin:false})
            }
        },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        UserData: state.UserData,
      }),
    }
  )
)


export default UserStore;