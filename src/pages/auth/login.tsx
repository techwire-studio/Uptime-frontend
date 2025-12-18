import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layouts/authLayout";
import { Routes } from "@/constants";
import { loginSchema, passwordSchema } from "@/validations/account";
import type { LoginFormType, PasswordFormType } from "@/types/account";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import ButtonWithLoader from "@/components/buttonWithLoader";

const LoginEmailStep = ({
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
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email },
  });

  const socialProviders = [
    {
      id: "google",
      icon: Mail,
      label: "Login with Google",
      onClick: () => alert("Google login"),
    },
    {
      id: "github",
      icon: GithubIcon,
      label: "Login with Github",
      onClick: () => alert("Github login"),
    },
  ];

  const onSubmit = (data: LoginFormType) => {
    onNext(data.email);
  };

  return (
    <>
      <AuthLayout>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Welcome back<span className="text-green-500">!</span>
        </h2>

        <div className="space-y-4">
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
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold flex items-center justify-center gap-2"
          >
            Log in with email
          </Button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#2a3441]" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#2a3441]" />
          </div>

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
        </div>
      </AuthLayout>

      <div className="mt-8 text-center">
        <div className="mb-6 text-center text-xs text-gray-400">
          Don't have an account yet?
        </div>
        <Button
          onClick={() => navigate(Routes.SIGNUP)}
          className="text-green-500 bg-transparent underline hover:text-green-400 font-semibold"
        >
          Create your Free account now{" "}
        </Button>
      </div>
    </>
  );
};

const LoginPasswordStep = ({
  onBack,
  onSubmit,
  showLoader,
}: {
  onBack: () => void;
  showLoader: boolean;
  onSubmit: (data: PasswordFormType) => void;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <>
      <AuthLayout showBack onBack={onBack}>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Just enter your password<span className="text-green-500">!</span>
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="text-white text-sm font-bold mb-2">
              Password
            </Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="bg-background border-[#2a3441] text-white placeholder:text-gray-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <ButtonWithLoader
            showLoader={showLoader}
            onClick={handleSubmit(onSubmit)}
            label="Login"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold"
          />
        </div>
      </AuthLayout>

      <div className="mt-8 text-center">
        <div className="mb-6 text-center text-xs text-gray-400">
          Don't have an account yet?
        </div>
        <Button
          onClick={() => navigate(Routes.SIGNUP)}
          className="text-green-500 bg-transparent underline hover:text-green-400 font-semibold"
        >
          Create your Free account now{" "}
        </Button>
      </div>
    </>
  );
};

const LoginFlow = () => {
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = (email: string) => {
    setEmail(email);
    setStep("password");
  };

  const handleBack = () => {
    setStep("email");
  };

  const handleSubmit = async (data: PasswordFormType) => {
    setIsLoading(true);

    const response = await authClient.signIn.email({
      email,
      password: data.password,
    });

    if (response.data) {
      toast.success("Login successfully!");
      navigate(Routes.MONITORS);
    } else {
      toast.error(response.error.message || "Failed to login");
    }
    setIsLoading(false);
  };

  return step === "email" ? (
    <LoginEmailStep email={email} onNext={handleNext} />
  ) : (
    <LoginPasswordStep
      onBack={handleBack}
      showLoader={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginFlow;
