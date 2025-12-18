import { Button } from "@/components/ui/button";
import type { Provider } from "@/pages/integrations/providers";
import { Lock, Plus } from "lucide-react";

const IntegrationCard = ({
  provider,
  onAdd,
}: {
  provider: Provider;
  onAdd: () => void;
}) => {
  const Icon = provider.icon;
  const premiumOnly =
    provider.availability &&
    provider.availability.solo === false &&
    provider.availability.team === true;

  return (
    <div className="bg-[#1a2332] rounded-lg p-6 flex items-center justify-between hover:border-gray-500 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-[#2a3441] rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-200" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{provider.name}</h3>
          <p className="text-xs text-gray-400">{provider.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {premiumOnly && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Available only in Team and Enterprise.</span>
          </div>
        )}

        {!premiumOnly && (
          <Button
            onClick={onAdd}
            className="bg-[#2a22c7] hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus size={6} />
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
