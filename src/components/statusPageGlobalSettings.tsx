import { useState } from "react";
import { Check, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type {
  GlobalSettingsType,
  RawStatusPagesType,
  StatusPageMonitorsList,
} from "@/types/status";
import ButtonWithLoader from "./buttonWithLoader";

interface GlobalSettingsStepProps {
  onFinish: (settings: GlobalSettingsType) => void;
  onBack: () => void;
  selectedMonitors: StatusPageMonitorsList[];
  showLoader: boolean;
  statusPage:
    | (RawStatusPagesType & { monitors: StatusPageMonitorsList[] })
    | null;
}

export default function GlobalSettingsStep({
  onFinish,
  onBack,
  showLoader,
  statusPage,
}: GlobalSettingsStepProps) {
  const [name, setName] = useState(statusPage?.name || "");
  const [domain, setDomain] = useState(statusPage?.custom_domain || "");

  const [density, setDensity] = useState("wide");
  const [alignment, setAlignment] = useState("left");

  const handleFinish = () => {
    const settings: GlobalSettingsType = {
      name,
      domain,
      layout: {
        density,
        alignment,
      },
      seo: {
        robots: "index",
      },
      security: {
        passwordEnabled: false,
        password: null,
      },
    };

    onFinish(settings);
  };

  const layoutOptions = [
    { value: "wide", label: "Wide" },
    { value: "compact", label: "Compact" },
  ];

  const alignmentOptions = [
    { value: "left", label: "Logo on left" },
    { value: "center", label: "Logo on center" },
  ];

  return (
    <div className="min-h-screen text-white">
      <Button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Status pages</span>
      </Button>
      <h1 className={`text-xl font-semibold ${statusPage ? "mb-1" : "mb-8"}`}>
        {statusPage ? (
          <>
            Edit <span className="text-green-500">{statusPage.name}</span>{" "}
            status page
          </>
        ) : (
          "Create status page."
        )}
      </h1>
      {statusPage && (
        <p className="mb-4 text-sm text-gray-400">
          Public status page, hosted on{" "}
          <a
            className="text-green-500"
            href={`http://localhost:5173/status-page/${statusPage.id}`}
          >
            {`http://localhost:5173/status-page/${statusPage.id}`}
          </a>
        </p>
      )}

      <div className="flex gap-10">
        <div className="flex-1 space-y-8">
          <Card className="bg-[#1a2332] border-[#2a3441] p-8 space-y-8 gap-2">
            <div className="flex items-center gap-5 justify-between">
              <div className="w-full">
                <Label className="text-sm mb-2 font-bold">
                  Name of the status page
                </Label>
                <p className="text-xs text-gray-500 mb-2">
                  * Required. It is used in status page heading, title, etc.
                </p>
                <Input
                  placeholder="E.g. Your Brand"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#131A25] border-[#2a3441]"
                />
              </div>

              <div className="w-full">
                <Label className="text-sm mb-2 font-bold">Custom domain</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Host your status page on your own domain.
                </p>
                <Input
                  placeholder="E.g. status.yourdomain.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="bg-[#0f1419] border-[#2a3441]"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 font-bold">Logo</Label>
              <p className="text-xs text-gray-500 mb-3">
                Accepted formats: .jpg, .jpeg, .png — up to 400x200px & under
                150kb.
              </p>

              <div className="border-2 border-dashed bg-[#131A25] border-[#2a3441] hover:border-gray-500 transition-colors rounded-lg p-2 text-center cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm mb-2 font-bold">
                  Drag & drop your logo here or choose by click
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3441] gap-0 p-8 space-y-6">
            <Label className="text-sm mb-2 font-bold block">Layout</Label>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <Label className="text-xs mb-2 font-bold">Density</Label>
                <p className="text-xs text-gray-500 mb-3">
                  Choose between wide readability or compact density.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {layoutOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDensity(option.value)}
                      className={`rounded-lg border-2 p-4 transition 
                      ${
                        density === option.value
                          ? "border-blue-500 ring-1 ring-blue-700"
                          : "border-[#2a3441] hover:border-gray-500"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs mb-2 font-bold">Alignment</Label>
                <p className="text-xs text-gray-500 mb-3">
                  Save space with left alignment or highlight your brand.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {alignmentOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAlignment(option.value)}
                      className={`rounded-lg border-2 p-4 transition 
                      ${
                        alignment === option.value
                          ? "border-blue-500 ring-1 ring-blue-700"
                          : "border-[#2a3441] hover:border-gray-500"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-64 shrink-0 space-y-6 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-gray-400">Monitors</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-green-500 font-semibold">
              Global settings
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <ButtonWithLoader
          type="submit"
          disabled={!name}
          showLoader={showLoader}
          label={statusPage ? "Save Changes" : "Finish: Create status page"}
          className="bg-[#2a22c7] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg mt-6"
          onClick={handleFinish}
        />
      </div>
    </div>
  );
}

{
  /* ROBOTS META */
}
{
  /* <Card className="bg-[#1a2332] border-[#2a3441] p-8">
            <Label className="text-sm mb-2 font-bold mb-3 block">
              Robots Meta Tag
            </Label>
            <Select
              value={robotsMeta}
              onValueChange={(v) => setRobotsMeta(v as "index" | "noindex")}
            >
              <SelectTrigger className="bg-[#0f1419] border-[#2a3441] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="index">
                  index (visible in search engines)
                </SelectItem>
                <SelectItem value="noindex">
                  noindex (hidden from search engines)
                </SelectItem>
              </SelectContent>
            </Select>
          </Card> */
}
