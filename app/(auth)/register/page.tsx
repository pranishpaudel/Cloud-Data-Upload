"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import signupSchema from "@/schema/SignUpSchema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignUpOtp } from "@/components/signupOtp";

export function Register() {
  const router = useRouter();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [tempEmailState, setTempEmailState] = useState(false);
  const [isverificationPending, setisverificationPending] = useState(false);
  const [tempEmail, setTempEmail] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const { formState } = form;
  const { errors, isSubmitting } = formState;

  function validateEmailRE(email: any) {
    // Regular expression pattern for validating email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern
    return emailPattern.test(email);
  }

  const checkVerificationPending = useEffect(() => {
    const fetchData = async () => {
      if (!tempEmailState) {
        return;
      }
      try {
        const response = await axios.get(
          `/api/checkVerificationPending?email=${tempEmail}`
        );
        if (response.data.message === "User is not verified") {
          const otpp = await axios.post("/api/sendOtp", { email: tempEmail });
          const otppData = otpp?.data;
          if (otppData) {
            setSignupSuccess(true);
          }
          setisverificationPending(true);
          return;
        } else if (response.data.message === "User is already verified") {
          setisverificationPending(false);
          toast({
            title: "User already registered",
            description: "Redirecting to login",
          });
          router.push("/login");
          return;
        }
        // Handle response data here
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    if (tempEmailState) {
      fetchData();
    }
  }, [tempEmailState, tempEmail, router, toast]);

  const validateEmail = (email: string) => {
    console.log(email);
    if (!validateEmailRE(email)) return;
    setTempEmail(email);
    setTempEmailState(true);
    console.log(tempEmail);
    console.log(tempEmailState);
    return;
  };
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log("asup", data);
    try {
      const user = await axios.post("/api/register", data);
      console.log(user.data);
      if (user.data) {
        toast({
          title: "User registered successfully",
          description: "Otp verification pending",
        });
        setEmail(data.email);
        const otp = await axios.post("/api/sendOtp", { email: data.email });
        const otpData = otp?.data;
        if (otpData) {
          setSignupSuccess(true);
        } else {
          toast({
            title: "Something went wrong",
            description: "Error sending otp to email",
            variant: "destructive",
          });
        }
        return;
      }
    } catch (error: any) {
      const axiosError = error.response.data;
      toast({
        title: "Something went wrong",
        description: axiosError?.message,
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <>
      {signupSuccess || isverificationPending ? (
        <SignUpOtp email={email || tempEmail} />
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="mx-auto w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-200/5 dark:bg-gray-900 dark:ring-gray-700/10">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Join PShow today.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          className="w-full"
                          onChange={(e) => {
                            field.onChange(e);

                            validateEmail(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Please Wait" : "Register"}
                </Button>
              </form>
            </Form>
          </div>
        </main>
      )}
    </>
  );
}

export default Register;
