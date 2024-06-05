// CountdownTimer.js
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { otpAtom, otpRetryAtom } from "@/helpers/state";
import { useAtom } from "jotai";

interface iprops {
  email: string;
}
const CountdownTimer = ({ email }: iprops) => {
  const [seconds, setSeconds] = useState(120);
  const [otp, setOtp] = useAtom(otpAtom);
  const [otpRetried, setotpRetried] = useAtom(otpRetryAtom);
  const [otpSent, setOtpSent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { toast } = useToast();
  const reSendAction = async () => {
    try {
      setOtpSent(true);
      const response = await axios.post("/api/sendOtp", { email });
      const data = response.data;
      if (data.message === "Otp sent successfully") {
        setOtp("");
        setSeconds(119);
        return;
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "Otp send operation failed",
        description: axiosError?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [seconds]);

  return (
    <div>
      <h1 className="w-[255px] h-[50px] border flex justify-center items-center p-[8px] text-white bg-black rounded-lg text-lg">
        {seconds > 0 ? (
          <div>Otp expires in: {seconds} seconds</div>
        ) : (
          <div className="gap-1">
            {otpSent ? (
              "Enter Otp"
            ) : (
              <>
                Otp Expired:{" "}
                <Button
                  disabled={isButtonDisabled}
                  className="bg-blue-500 hover:bg-blue-500 hover:brightness-50"
                  onClick={reSendAction}
                >
                  Resend?
                </Button>
              </>
            )}
          </div>
        )}
      </h1>
    </div>
  );
};

export default CountdownTimer;
