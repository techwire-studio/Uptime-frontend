import ButtonWithLoader from "@/components/buttonWithLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth";
import type { SecurityType } from "@/types/account";
import { securitySchema } from "@/validations/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Security = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(securitySchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ currentPassword, newPassword }: SecurityType) => {
    setIsLoading(true);
    const { data, error } = await authClient.changePassword({
      newPassword,
      currentPassword,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to update password");
      return;
    }

    if (data) {
      toast.success("Password updated successfully");
      reset();
      return;
    }
  };

  return (
    <div className="bg-primary rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
      <div className="border-b mb-4 py-2 border-gray-700">
        <Label className="text-white text-sm font-bold">Current Password</Label>
        <Input
          placeholder="*********"
          {...register("currentPassword")}
          className="bg-[#0f1419] border-[#2a3441] mt-3 text-white"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-xs my-2">
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div className="border-b mb-4 py-2 border-gray-700">
        <Label className="text-white text-sm font-bold">New Password</Label>
        <Input
          placeholder="*********"
          {...register("newPassword")}
          className="bg-[#0f1419] border-[#2a3441] mt-3 text-white"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-xs my-2">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="border-b mb-4 py-2 border-gray-700">
        <Label className="text-white text-sm font-bold">
          Confirm New Password
        </Label>
        <Input
          placeholder="*********"
          {...register("confirmNewPassword")}
          className="bg-[#0f1419] border-[#2a3441] mt-3 text-white"
        />
        {errors.confirmNewPassword && (
          <p className="text-red-500 text-xs my-2">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>
      <ButtonWithLoader
        onClick={handleSubmit(onSubmit)}
        className="bg-[#2a22c7] hover:bg-blue-700 text-white"
        showLoader={isLoading}
        label="Save Changes"
      />
    </div>
  );
};

export default Security;
