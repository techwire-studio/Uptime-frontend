interface EmptyStateButton {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title?: string;
  highlight?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryButton?: EmptyStateButton;
  secondaryButton?: EmptyStateButton;
}

export default function EmptyState({
  title = "Your",
  description = "Once we detect some incidents, they will be neatly displayed for quick and easy understanding. 🧠",
  imageSrc = "/empty.webp",
  imageAlt = "Incident list preview",
  primaryButton,
  secondaryButton,
}: EmptyStateProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative mx-auto flex items-center justify-between gap-10 py-28">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold text-white">{title}</h2>

          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            {description}
          </p>

          {(primaryButton || secondaryButton) && (
            <div className="mt-10 flex items-center gap-4">
              {primaryButton && (
                <button
                  onClick={primaryButton.onClick}
                  className="px-4 py-2 text-sm rounded-md bg-[#2a22c7] font-medium transition"
                >
                  {primaryButton.label}
                </button>
              )}

              {secondaryButton && (
                <button
                  onClick={secondaryButton.onClick}
                  className="px-6 py-3 rounded-md border border-white/20 text-white hover:bg-white/5 transition"
                >
                  {secondaryButton.label}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-[#0c121a]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-[800px] object-cover opacity-95"
          />
        </div>
      </div>
    </div>
  );
}
