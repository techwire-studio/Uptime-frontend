interface EmptyStateProps {
  title?: string;
  highlight?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function EmptyState({
  title = "Your",
  highlight = "incidents overview",
  description = "Once we detect some incidents, they will be neatly displayed for quick and easy understanding. 🧠",
  imageSrc = "/empty.webp",
  imageAlt = "Incident list preview",
}: EmptyStateProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute top-10 left-0 w-72 h-72 rounded-full bg-[#0f1f25] opacity-40 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#0f1f25] opacity-40 blur-3xl" />
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#0e3028] opacity-40 blur-3xl" />

      <div className="relative mx-auto flex items-center justify-between gap-10 px-10 py-28">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold text-white leading-tight">
            {title} <span className="text-green-400">{highlight}</span> on the
            way!
          </h2>
          <p className="mt-6 text-lg text-gray-300 leading-relaxed">
            {description}
          </p>
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
