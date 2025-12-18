import { z } from "zod";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import type { Provider } from "@/pages/integrations/providers";
import ButtonWithLoader from "./buttonWithLoader";

type Props = {
  open: boolean;
  provider: Provider;
  onClose: () => void;
  onSubmit: (data: Record<string, string | unknown>) => void;
};

const IntegrationModal = ({ open, provider, onClose, onSubmit }: Props) => {
  const Icon = provider.icon;

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};

    provider.fields.forEach((f) => {
      shape[f.key] = f.schema;
    });

    shape.events = z.string().min(1);

    return z.object(shape);
  }, [provider]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Record<string, string | unknown>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      events: provider.defaultEvents.join(", "),
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl border border-[#2a3441] bg-[#141c2b] p-0 text-white">
        <DialogHeader className="flex flex-col items-center px-6 pt-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#5865f2]/20">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <DialogTitle className="text-lg font-semibold leading-tight">
            Add <span className="text-green-500 mr-1">{provider.name}</span>
            integration
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 bg-primary px-6 py-6"
        >
          {provider.fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-300">
                {field.label}
              </Label>

              <Controller
                name={field.key}
                control={control}
                render={({ field: rhf }) => (
                  <Input
                    {...rhf}
                    value={typeof rhf.value === "string" ? rhf.value : ""}
                    placeholder={field.placeholder}
                    className="h-10 bg-[#0f1419] border border-[#2a3441] text-sm text-white placeholder:text-gray-500"
                  />
                )}
              />

              {errors[field.key] && (
                <p className="text-xs text-red-400">
                  {errors[field.key]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-300">
              Events to notify about
            </Label>

            <Controller
              name="events"
              control={control}
              render={({ field }) => (
                <Select
                  value={typeof field.value === "string" ? field.value : ""}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="h-11 bg-[#0f1419] w-full border border-[#2a3441] text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border border-[#2a3441] text-white">
                    <SelectItem value="UP, DOWN, SSL_EXPIRY, DOMAIN_EXPIRY">
                      Up events, Down events, SSL & Domain expiry
                    </SelectItem>
                    <SelectItem value="DOWN">Down events only</SelectItem>
                    <SelectItem value="UP">Up events only</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-[#2a3441] pt-5">
            <Button
              type="button"
              onClick={onClose}
              className="h-11 w-full  bg-background border border-[#2a3441] text-gray-300 hover:bg-[#1a2332]"
            >
              Cancel
            </Button>

            <ButtonWithLoader
              type="submit"
              disabled={!isValid}
              label="Create integration"
              className="h-11 w-full bg-[#2a22c7] text-white hover:bg-blue-700 disabled:opacity-50"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;
