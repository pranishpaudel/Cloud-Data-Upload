"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "./ui/button";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CountdownTimer from "./CountDownTimer";
import { otpAtom } from "@/helpers/state";
import { useAtom } from "jotai";
interface SignUpOtpProps {
  email: string;
}

export function SignUpOtp({ email }: SignUpOtpProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [userVerfied, setUserVerified] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  // Correctly destructuring the email prop
  const [value, setValue] = useAtom(otpAtom);

  const redirectLogin = React.useEffect(() => {
    if (userVerfied) {
      router.push("/login");
    }
  }, [userVerfied, router]);

  const handleOTP = async () => {
    try {
      setIsButtonDisabled(true);
      const zValidation = z.string().min(6).max(6).parse(value);
      // Add logic to verify the OTP here
      if (zValidation) {
        try {
          const response = await axios.post("/api/verifyOtp", {
            email,
            userOtp: value,
          });
          const data = response?.data;
          if (data.message === "User verified successfully") {
            setUserVerified(true);
            toast({
              title: "User Verfied",
              description: data?.message,
            });
            return;
          }
        } catch (error: any) {
          toast({
            title: "Incorrect Otp",
            description: error?.response?.data?.message,
            variant: "destructive",
          });
          setIsButtonDisabled(false);
          return;
        }
      }
    } catch (error) {
      setIsButtonDisabled(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center text-2xl text-black font-bold relative top-[50px]">
        Enter the otp sent to {email} {/* Correctly using the email prop */}
      </div>
      <div className="space-y-2 flex justify-center items-center relative top-[60px]">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex justify-center items-center text-lg font-semibold text-zinc-600 relative top-[75px]">
        {value === "" ? (
          <>Enter your one-time password.</>
        ) : (
          <>
            You entered: <span className="text-blue-500">{value}</span>
          </>
        )}
      </div>
      <div className="flex justify-center items-center bg-black text-white rounded-md h-12 w-[100px] mt-4 relative top-[80px] left-[47%] hover:brightness-50">
        <button onClick={handleOTP} type="submit" disabled={isButtonDisabled}>
          Verify
        </button>
      </div>
      <div className="flex items-center relative top-[100px] left-[42.6%] ">
        <CountdownTimer email={email} />
      </div>
    </>
  );
}
