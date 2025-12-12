interface StatCardProps {
  title: string;
  rightLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const StatCard = ({
  title,
  rightLabel,
  children,
  className = "",
}: StatCardProps) => {
  return (
    <div
      className={`bg-primary border border-primary p-7 rounded-xl ${className}`}
    >
      <div className="text-[14px] tracking-wide font-medium">{title}</div>

      {rightLabel && (
        <div className="text-xl my-2 font-semibold text-white">
          {rightLabel}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
