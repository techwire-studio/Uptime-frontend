import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accountInfoSchema, contactInfoSchema } from "@/validations/account";
import type {
  AccountInfoType,
  ContactInfoType,
  UserMetaDataType,
  UserType,
} from "@/types/account";
import Alert from "@/components/alertConfirmation";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";
import ButtonWithLoader from "@/components/buttonWithLoader";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import PulseLoader from "@/components/loader";
import { TIMEZONES } from "@/constants";

const updateUserMetadata = async (
  payload: Partial<UserMetaDataType>,
  userId: string
) => {
  try {
    const { data } = await axiosInstance.patch(`/users/${userId}`, {
      payload,
    });

    if (data.success) toast.success("User updated successfully");
  } catch {
    toast.error("Failed to update user.");
  }
};

const AccountInfoForm = ({
  user,
}: {
  user: {
    id: string;
    name: string;
    timezone?: string;
  };
}) => {
  const { id: userId, name: fullName, timezone } = user;

  const tz = TIMEZONES.find((zone) => zone.value === timezone)?.value as string;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      fullName,
      timezone: tz,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (payload: AccountInfoType) => {
    setIsLoading(true);

    if (fullName !== payload.fullName) {
      const { data, error } = await authClient.updateUser({
        name: payload.fullName,
      });

      if (error) {
        toast.error(error.message || "Failed to update user");
        setIsLoading(false);
        return;
      }

      if (data) toast.success("User updated successfully");
    }

    if (timezone !== payload.timezone) {
      await updateUserMetadata({ timezone: payload.timezone }, userId);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-primary rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-6">Account info</h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-white text-sm mb-2 block font-medium">
            Full name
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Used to display in applications and in all communications with you.
          </p>
          <Input
            {...register("fullName")}
            className="bg-[#0f1419] border-[#2a3441] text-white"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-white text-sm mb-2 block font-medium">
            Timezone
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            We will display all the date and time based on this setting.
          </p>
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full bg-[#0f1419] border-[#2a3441] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1419] border-[#2a3441] text-white max-h-60 overflow-auto">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
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

const ContactInfoForm = ({
  user,
}: {
  user: {
    id: string;
    email: string;
    phoneNumber?: string;
    countryCode?: string;
  };
}) => {
  const { id: userId, email, countryCode, phoneNumber } = user;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactInfoType>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      primaryEmail: email,
      phoneNumber,
      countryCode,
    },
  });

  const onSubmit = async (data: ContactInfoType) => {
    if (!data.phoneNumber) return;

    setIsLoading(true);
    await updateUserMetadata(
      {
        sms_country_code: data.countryCode,
        sms_phone_number: data.phoneNumber,
      },
      userId
    );
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-primary rounded-lg p-6 mb-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Contact Info.</h2>

      <div className="mb-6">
        <Label className="text-white text-sm mb-2 block font-medium">
          Primary E-mail address
        </Label>
        <p className="text-xs text-gray-400 mb-2">
          This e-mail is used to login, get alert notifications and reports.
        </p>
        <Input
          disabled
          {...register("primaryEmail")}
          type="email"
          className="bg-[#0f1419] border-[#2a3441] text-white"
        />
        {errors.primaryEmail && (
          <p className="text-red-500 text-xs mt-1">
            {errors.primaryEmail.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <Label className="text-white text-sm mb-2 block font-medium">
          Phone number
        </Label>
        <p className="text-xs text-gray-400 mb-2">
          We use this for SMS and voice call notifications.
        </p>

        <div className="flex gap-2">
          <Controller
            control={control}
            name="countryCode"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-32 bg-[#0f1419] border-[#2a3441] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1419] border-[#2a3441] text-white">
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  <SelectItem value="+91">🇮🇳 +91</SelectItem>
                  <SelectItem value="+86">🇨🇳 +86</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Input
            {...register("phoneNumber")}
            type="number"
            className="flex-1 bg-[#0f1419] border-[#2a3441] text-white"
          />
        </div>

        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <ButtonWithLoader
        type="submit"
        className="bg-[#2a22c7] hover:bg-blue-700 text-white"
        showLoader={isLoading}
        label="Save Changes"
      />
    </form>
  );
};

const DeleteAccountForm = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteClick = () => setShowConfirmation(true);

  const sendConfirmationEmail = () => {
    console.log(password);
  };

  return (
    <div className="bg-primary rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Delete account.</h2>

      <p className="text-sm text-gray-400 mb-4">
        UptimeRobot sends an "account deletion verification e-mail" to the
        account e-mail. Once the verification link inside the e-mail is clicked,
        all account information at UptimeRobot (including the account, monitors,
        logs and settings) will be lost and{" "}
        <span className="text-white font-semibold">can not be recovered</span>!
      </p>

      {!showConfirmation ? (
        <Button
          onClick={handleDeleteClick}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Delete account
        </Button>
      ) : (
        <Alert
          open
          onConfirm={sendConfirmationEmail}
          confirmText="Send Confirmation e-mail"
          cancelText="Keep My Account"
          isConfirmButtonDisabled={!password}
          onCancel={() => setShowConfirmation(false)}
          title="Are you sure you want to delete your account?"
          description="After confirming account deletion by clicking the link in the email you will lose your account permanently."
        >
          <div className="border-t mt-2 border-gray-700">
            <Label className="text-white text-sm my-2 font-medium">
              Enter your password
            </Label>
            <p className="text-xs text-gray-400 mb-2">
              To proceed you need to enter your account password.
            </p>
            <Input
              placeholder="********"
              onChange={(event) => setPassword(event.target.value)}
              className="bg-[#0f1419] border-[#2a3441] text-white"
            />
          </div>
        </Alert>
      )}
    </div>
  );
};

export default function AccountDetails({ user }: { user: UserType }) {
  const getUserMetadata = async () => {
    const { data } = await axiosInstance.get(`/users/${user.id}`);
    return data;
  };

  const { data: response, isLoading } = useQuery<{
    data: UserMetaDataType;
    success: boolean;
  }>({
    queryKey: ["metadata"],
    queryFn: getUserMetadata,
  });

  if (isLoading) return <PulseLoader />;

  const metadata = response?.data;

  return (
    <>
      <AccountInfoForm
        user={{
          id: user.id,
          name: user.name,
          timezone: response?.data?.timezone || "Etc/UTC",
        }}
      />
      <ContactInfoForm
        user={{
          id: user.id,
          email: user.email,
          countryCode: metadata?.sms_country_code ?? "+1",
          phoneNumber: metadata?.sms_phone_number ?? "",
        }}
      />
      <DeleteAccountForm />
    </>
  );
}
