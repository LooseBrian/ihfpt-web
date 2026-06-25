interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div
        className={`mt-4 flex ${align === "center" ? "justify-center" : "justify-start"}`}
      >
        <div className="h-1 w-16 bg-brand-500 rounded-full" />
      </div>
    </div>
  );
}
