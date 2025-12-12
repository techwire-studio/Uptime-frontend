import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Monitor, ChevronDown, Lock, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import IntervalSlider from "@/components/intervalSlider";
import {
  createNewMonitorSchema,
  type CreateNewMonitorType,
} from "@/validations/monitor";
import {
  MonitorCreationEnum,
  type RawMonitorChecksType,
  type RawMonitorsType,
} from "@/types/monitor";

export default function CreateNewMonitor({
  onSubmit,
  action,
  monitor,
}: {
  onSubmit: (data: CreateNewMonitorType) => void;
  action?: MonitorCreationEnum;
  monitor?: Omit<RawMonitorsType, "checks"> & {
    checks: RawMonitorChecksType[];
  };
}) {
  const [tags, setTags] = useState<string[]>(monitor?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [intervalLabel, setIntervalLabel] = useState("5m");

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNewMonitorType>({
    resolver: zodResolver(createNewMonitorSchema),
    defaultValues: {
      url: monitor?.url || "https://",
      group: "monitors-default",
      tags: monitor?.tags ?? [],
      notifications: {
        email: true,
        sms: false,
        voice: false,
        push: false,
      },
      interval: monitor?.interval_seconds || 300,
    },
  });

  const interval = useWatch({ control, name: "interval" });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue("tags", newTags);
  };

  return (
    <div className="min-h-screen bg-primary text-gray-200 p-4 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-400 mb-3 block">
            Monitor type
          </Label>
          <div className="bg-[#1a2332] border border-gray-700 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-[#1f2937] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Monitor className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">
                  HTTP / website monitoring
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Use HTTP(S) monitor to monitor your website, API endpoint, or
                  anything running on HTTP.
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-400 mb-3 block">
            URL to monitor
          </Label>
          <Input
            {...register("url")}
            type="text"
            className={`w-full bg-[#1a2332] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.url ? "border-red-500" : "border-gray-700"
            }`}
            placeholder="https://"
          />
          {errors.url && (
            <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-400 mb-2 block">
              Group
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Your monitor will be automatically added to the chosen group
            </p>
            <Select
              defaultValue="monitors-default"
              onValueChange={(value) => setValue("group", value)}
            >
              <SelectTrigger className="w-full bg-[#1a2332] border border-gray-700 text-white hover:bg-[#1f2937]">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-gray-700">
                <SelectItem
                  value="monitors-default"
                  className="text-white hover:bg-[#1f2937]"
                >
                  Monitors (default)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.group && (
              <p className="text-red-500 text-xs mt-1">
                {errors.group.message}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 flex-wrap">
              <Lock className="w-3 h-3" />
              <span>
                Groups are available only on{" "}
                <span className="font-medium">Paid plans</span>.
              </span>
              <a href="#" className="text-green-400 hover:underline">
                Upgrade now
              </a>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-400 mb-2 block">
              Add tags
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Tags will enable you to organise your monitors in a better way
            </p>
            <div className="bg-[#1a2332] border border-gray-700 text-sm rounded-lg px-4 py-2 flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-blue-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 min-w-[120px]"
                placeholder="Click to add tag..."
              />
            </div>
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-400 mb-3 block">
            How will we notify you?
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["email", "sms", "voice", "push"].map((type) => (
              <div key={type}>
                <label
                  className={`flex items-center gap-2 mb-2 cursor-pointer ${
                    type !== "email" ? "opacity-50" : ""
                  }`}
                >
                  <Checkbox
                    checked={type === "email"}
                    disabled={type !== "email"}
                    className="rounded bg-[#1a2332] border-gray-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span className="text-sm text-white">
                    {type === "email"
                      ? "E-mail"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
                {type === "email" && (
                  <p className="text-xs text-gray-400 mb-2">random@gmail.com</p>
                )}
                {type !== "email" && (
                  <a
                    href="#"
                    className="text-xs text-green-400 hover:underline mb-2 block"
                  >
                    Add {type === "push" ? "app" : "phone number"}
                  </a>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <RefreshCw className="w-3 h-3" />
                  <span>No delay, no repeat</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-400 mb-2 block">
            Monitor interval
          </Label>

          <p className="text-xs text-gray-400 mb-4">
            Your monitor will be checked every {intervalLabel}
          </p>

          <div className="relative w-full">
            <IntervalSlider
              value={interval}
              onChange={({ value, label }) => {
                setValue("interval", value);
                setIntervalLabel(label);
              }}
            />
          </div>

          {errors.interval && (
            <p className="text-red-500 text-xs mt-1">
              {errors.interval.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-[#2a22c7] hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg mt-6"
        >
          {action === MonitorCreationEnum.EDIT
            ? "Save Changes"
            : "Create Monitor"}
        </Button>
      </form>
    </div>
  );
}
