import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerDetailsSchema,
  registerEmailSchema,
} from "@/validations/account";
import AuthLayout from "@/components/layouts/authLayout";
import { Routes } from "@/constants";
import { useNavigate } from "react-router-dom";
import type { RegisterFormType } from "@/types/account";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import ButtonWithLoader from "@/components/buttonWithLoader";

const RegisterPage = ({
  email,
  onNext,
}: {
  email: string;
  onNext: (email: string) => void;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit: SubmitHandler<{ email: string }> = (data) => {
    onNext(data.email);
  };

  const socialProviders = [
    {
      id: "google",
      icon: Mail,
      label: "Register with Google",
      onClick: () => alert("Google login"),
    },
    {
      id: "github",
      icon: GithubIcon,
      label: "Register with Github",
      onClick: () => alert("Github login"),
    },
  ];

  return (
    <>
      <AuthLayout>
        <h2 className="text-xl font-bold text-white text-center mb-6">
          Register your FREE account
          <span className="text-green-500">.</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-3">
            {socialProviders.map(({ id, icon: Icon, label, onClick }) => (
              <Button
                key={id}
                type="button"
                onClick={onClick}
                className="w-full bg-background hover:bg-[#2a3441] text-white text-sm flex items-center justify-center gap-2"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#2a3441]"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a3441]"></div>
          </div>

          <div>
            <Label className="text-white text-sm font-bold mb-2">
              Your e-mail
            </Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="E.g. info@example.com"
              className="bg-background border-[#2a3441] text-white placeholder:text-gray-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-green-500 hover:bg-green-600 text-black text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Register with email
          </Button>
        </div>
      </AuthLayout>

      <div className="mt-8 text-center">
        <Button
          onClick={() => navigate(Routes.LOGIN)}
          className="text-green-500 bg-transparent underline hover:text-green-400 font-semibold"
        >
          Already have an account?
        </Button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        By creating account you agree to our{" "}
        <a href="#" className="underline hover:text-white">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-white">
          Privacy Policy
        </a>
      </div>
    </>
  );
};

const RegisterDetailsPage = ({
  onSubmit,
  onBack,
  showLoader,
}: {
  onSubmit: (data: RegisterFormType) => void;
  showLoader: boolean;
  onBack: () => void;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerDetailsSchema),
  });

  return (
    <>
      <AuthLayout showBack onBack={onBack}>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Enter your details<span className="text-green-500">.</span>
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="text-white text-sm mb-2 block">
              Your full name
            </Label>
            <div className="relative">
              <Input
                {...register("fullName")}
                type="text"
                placeholder="E.g. John Doe"
                className="bg-background border-[#2a3441] text-white placeholder:text-gray-500 pr-10"
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <Label className="text-white text-sm">Password</Label>
              <span className="text-xs text-gray-500">min. 8 characters</span>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type="password"
                placeholder="******"
                className="bg-background border-[#2a3441] text-white placeholder:text-gray-500 pr-10"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <ButtonWithLoader
            showLoader={showLoader}
            onClick={handleSubmit(onSubmit)}
            label="Register now"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
          />
        </div>
      </AuthLayout>
      <div className="mt-8 text-center">
        <Button
          onClick={() => navigate(Routes.LOGIN)}
          className="text-green-500 bg-transparent underline hover:text-green-400 font-semibold"
        >
          Already have an account?
        </Button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        By creating account you agree to our{" "}
        <a href="#" className="underline hover:text-white">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-white">
          Privacy Policy
        </a>
      </div>
    </>
  );
};

const RegistrationFlow = () => {
  const [step, setStep] = useState<"email" | "details">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (email: string) => {
    setEmail(email);
    setStep("details");
  };

  const handleBack = () => {
    setEmail(email);
    setStep("email");
  };

  const handleSubmit = async (data: RegisterFormType) => {
    setIsLoading(true);

    const response = await authClient.signUp.email({
      name: data.fullName,
      email,
      password: data.password,
    });

    if (response.data) {
      toast.success("Account created successfully!");
      navigate(Routes.MONITORS);
    } else {
      toast.error("Failed to create account");
    }

    setIsLoading(false);
  };

  return step === "email" ? (
    <RegisterPage email={email} onNext={handleNext} />
  ) : (
    <RegisterDetailsPage
      onBack={handleBack}
      showLoader={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default RegistrationFlow;
