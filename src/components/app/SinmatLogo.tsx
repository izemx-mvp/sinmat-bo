import { cn } from "@/lib/utils";

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
      <span className="relative flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path d="M4 17.5 12 4l8 13.5H4Z" fill="rgba(255,255,255,0.92)" />
          <path d="M9.2 17.5 12 12.8l2.8 4.7H9.2Z" fill="oklch(0.32 0.079 251)" />
        </svg>
      </span>
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
