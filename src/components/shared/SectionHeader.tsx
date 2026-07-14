interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  theme?: "brand" | "trust";
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
  theme = "brand",
}: SectionHeaderProps) {
  const titleColor = theme === "trust" ? "text-trust-900" : "text-brand-900";
  const accentColor = theme === "trust" ? "bg-trust-500" : "bg-brand-500";

  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className={`text-2xl md:text-3xl font-bold ${titleColor} mb-3`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div
        className={`mt-4 flex ${align === "center" ? "justify-center" : "justify-start"}`}
      >
        <div className={`h-1 w-16 ${accentColor} rounded-full`} />
      </div>
    </div>
  );
}
