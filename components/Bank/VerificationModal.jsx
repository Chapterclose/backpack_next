import Button from "@/components/Form/Button";
import FormInput from "@/components/Form/FormInput";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function VerificationModal({ isOpen, onClose, onVerify }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (code.length !== 4) {
      setError("Please enter a 4-digit code.");
      return;
    }
    onVerify();
    setCode("");
    setError("");
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(value);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-4">
        <DialogHeader>
          <DialogTitle>Security Verification</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please enter the 4-digit verification code sent to your device.
          </p>
          <FormInput
            label="Verification Code"
            placeholder="0000"
            value={code}
            onChange={handleChange}
            maxLength={4}
            className="mb-0"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button text="Verify" handleFunc={handleVerify} className="w-full" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
