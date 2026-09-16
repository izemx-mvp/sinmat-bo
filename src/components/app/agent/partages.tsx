import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CaseACocher({
  id,
  label,
  coche,
  onChange,
  description,
}: {
  id: string;
  label: string;
  coche: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-md px-1 py-1.5">
      <Checkbox id={id} checked={coche} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-[13px] font-medium leading-snug text-foreground">
          {label}
        </Label>
        {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function SousSection({
  titre,
  description,
  children,
  className,
}: {
  titre: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="section-label text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {titre}
        </p>
        {description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function LigneChamp({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <Label className="text-[12px]">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
