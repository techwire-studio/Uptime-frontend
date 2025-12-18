import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthLayout = ({
  children,
  showBack = false,
  onBack,
}: {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}) => (
  <div className="bg-background flex items-center justify-center p-4 relative">
    {showBack && (
      <Button
        onClick={onBack}
        className="absolute bg-transparent border border-gray-700 text-xs top-6 left-6 flex items-center gap-1"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </Button>
    )}

    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 my-8">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <h1 className="text-2xl font-bold text-white">UptimeRobot</h1>
        </div>
      </div>

      <div className="bg-primary rounded-lg p-8 shadow-xl">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
