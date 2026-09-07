import { Link, useNavigate } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

type LienProps = Omit<ComponentProps<typeof Link>, "to"> & {
  to: string;
  children?: ReactNode;
};

/** Lien interne acceptant un chemin construit dynamiquement. */
export function Lien({ to, ...props }: LienProps) {
  return <Link to={to as never} {...props} />;
}

/** Navigation programmatique vers un chemin dynamique. */
export function useAller() {
  const navigate = useNavigate();
  return (to: string) => navigate({ to: to as never });
}
