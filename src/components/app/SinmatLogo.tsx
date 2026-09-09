import { cn } from "@/lib/utils";
import logoAsset from "@/assets/sinmat-logo.png.asset.json";

export function SinmatLogo({
  compact = false,
  dark = false,
  className,
}: {
  compact?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logoAsset.url}
        alt="Logo SINMAT"
        className="size-9 shrink-0 object-contain"
      />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-display text-[17px] font-bold tracking-[0.14em]",
              dark ? "text-foreground" : "text-sidebar-accent-foreground",
            )}
          >
            SINMAT
          </span>
          <span
            className={cn(
              "mt-1 text-[11px] font-medium tracking-wide",
              dark ? "text-muted-foreground" : "text-sidebar-foreground/55",
            )}
          >
            Gestion SINMAT
          </span>
        </span>
      )}
    </div>
  );
}
