import api, { apiWithoutToken } from "@/lib/utils";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const UserStore = create(
  persist(
    (set) => ({
      isUserLogin: false,
      isLoading: false,
      UserData: null,
      UserLoginRequest: async (body) => {
        try {
          set({ isUserLogin: true });
          set({ isLoading: true });
          let res = await apiWithoutToken.post("/auth/connect_metamask/", body);
          // Set cookie using js-cookie on client
          try {
            Cookies.set("access", res.data?.access || "", { expires: 7, path: "/" });
          } catch {}
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem("access", res.data?.access || "");
            } catch {}
          }
          set({ UserData: res.data["customer"] });
          return res;
        } catch (e) {
          console.log(e);
          return e;
        } finally {
          set({ isUserLogin: false });
          set({ isLoading: false });
        }
      },
      GetUserInfoRequest: async (body) => {
        try {
          set({ isUserLogin: true });
          set({ isLoading: true });
          let res = await api.get("/auth/profile-information/", body);
          set({ UserData: res.data["customer"] });
          return res;
        } catch (e) {
          console.log(e);
          return e;
        } finally {
          set({ isUserLogin: false });
          set({ isLoading: false });
        }
      },

      AccountBalance: null,
      GetAccountBalanceRequest: async () => {
        try {
          set({ isUserLogin: true });
          set({ isLoading: true });
          let res = await api.get("/trade/account-balance/");
          set({ AccountBalance: res.data });
          return res;
        } catch (e) {
          console.log(e);
          return e;
        } finally {
          set({ isUserLogin: false });
          set({ isLoading: false });
        }
      },
      HealthCheckRequest: async () => {
        try {
          set({ isUserLogin: true });
          set({ isLoading: true });
          let res = await api.get("/auth/health-check/");
          console.log(res);
        } catch (e) {
          console.log(e);
          return e;
        } finally {
          set({ isUserLogin: false });
          set({ isLoading: false });
        }
      },

      PrimaryCertificationRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/auth/primary-certificate/", body);
          toast.success(res.data["message"]);
          return res.status;
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      // Email
      SendEmailOtpRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/auth/send-email-otp/", body);
          toast.success(res.data["message"]);
          return res.status;
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },

      VerifyOtpRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/auth/verify-otp/", body);
          // toast.success(res.data['message'])
          return res;
        } catch (e) {
          return e;
        } finally {
          set({ isLoading: false });
        }
      },

      // Bank Apis
      bankInfo: null,
      GetBankInfoRequest: async () => {
        try {
          set({ isLoading: true });
          let res = await api.get("/auth/bank-account/");
          set({ bankInfo: res.data?.bank_cards });
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },
      CreateBankAccountRequest: async (body) => {
        try {
          set({ isLoading: true });
          let res = await api.post("/auth/bank-account/", body);
          toast.success(res.data.message);
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },
      BankAccountEditRequest: async (body, id) => {
        try {
          set({ isLoading: true });
          let res = await api.put(`/auth/bank-account/${id}/`, body);
          toast.success(res.data.message);
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },
      BankAccountDeleteRequest: async (id) => {
        try {
          set({ isLoading: true });
          let res = await api.delete(`/auth/bank-account/${id}/`);
          toast.success(res.data.message);
          return res;
        } catch (e) {
          console.log(e);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        UserData: state.UserData,
        AccountBalance: state.AccountBalance,
      }),
    }
  )
);

export default UserStore;
