import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { PROVIDERS, type Provider } from "@/pages/integrations/providers";
import IntegrationCard from "@/components/integrationCard";
import IntegrationModal from "@/components/integrationModal";
import { useDebounce } from "@/lib/debounce";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import type { SidebarOptionsType } from "@/types/core";
import { OptionsSidebar } from "@/components/optionsSidebar";
import { useAuth } from "@/hooks/use-auth";

const CATEGORIES: SidebarOptionsType[] = [
  { id: "all", label: "All" },
  { id: "chat", label: "Chat platforms" },
  { id: "webhooks", label: "Webhooks" },
  { id: "connectors", label: "Connectors & Incident management" },
  { id: "push", label: "Push notifications" },
  { id: "api", label: "API" },
];

const SearchBar = ({
  value,
  setInputValue,
  debouncedSetSearchTerm,
}: {
  value: string;
  setInputValue: (value: string) => void;
  debouncedSetSearchTerm: (value: string) => void;
}) => (
  <div className="relative mb-4">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
    <Input
      type="text"
      placeholder="Search by name or url"
      value={value}
      onChange={(e) => {
        setInputValue(e.target.value);
        debouncedSetSearchTerm(e.target.value);
      }}
      className="bg-gray-800/50 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none"
    />
  </div>
);

const Integrations = () => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSetSearchTerm = useDebounce((val: string) =>
    setSearchTerm(val)
  );

  const { user } = useAuth();

  const createNewAlertChannel = async (
    data: Record<string, string | unknown>
  ) => {
    if (!provider) return;

    try {
      const payload = {
        type: provider.id,
        config: {
          ...data,
          events: String(data.events || "")
            .split(",")
            .map((event) => event.trim())
            .filter(Boolean),
        },
      };

      const { data: response } = await axiosInstance.post(
        `/workspaces/${user.workspaceId}/integrations`,
        payload
      );

      if (response.success) {
        toast.success("Integration created successfully!");
        setModalOpen(false);
      } else {
        toast.error("Failed to create integration.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  function filterProviders(
    providers: typeof PROVIDERS,
    searchTerm: string,
    categoryId = "all"
  ) {
    const lowerSearch = searchTerm.toLowerCase();

    const categoryObj = CATEGORIES.find(
      (category) => category.id === categoryId
    );
    const categoryLabel = categoryObj ? categoryObj.label : null;

    return Object.values(providers).filter((provider) => {
      const matchesSearch = provider.name.toLowerCase().includes(lowerSearch);
      if (categoryId === "all" || !categoryLabel) return matchesSearch;
      return matchesSearch && provider.category === categoryLabel;
    });
  }

  const filteredList = filterProviders(PROVIDERS, searchTerm, category.id);

  const openModal = (provider: Provider) => {
    setProvider(provider);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen mt-4 bg-background text-white flex">
      <OptionsSidebar
        options={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />
      <div className="flex-1 p-8">
        <h1 className="text-2xl mb-4 font-bold">
          Integrations<span className="text-green-500">.</span>
        </h1>
        <SearchBar
          value={inputValue}
          setInputValue={setInputValue}
          debouncedSetSearchTerm={debouncedSetSearchTerm}
        />
        <div className="space-y-4">
          {filteredList.map((p) => (
            <IntegrationCard
              key={p.id}
              provider={p}
              onAdd={() => openModal(p)}
            />
          ))}
        </div>
        {filteredList.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No integrations found matching your search.
          </div>
        )}
      </div>

      {provider && (
        <IntegrationModal
          open={modalOpen}
          provider={provider}
          onClose={() => setModalOpen(false)}
          onSubmit={createNewAlertChannel}
        />
      )}
    </div>
  );
};

export default Integrations;
