import { useCallback, useEffect, useState } from "react";

export type Plateforme = "WHATSAPP" | "INSTAGRAM" | "FACEBOOK";
export type StatutIntegration = "CONNECTED" | "DISCONNECTED" | "WARNING";

export interface Integration {
  id: string;
  platform: Plateforme;
  display_name: string;
  account_name: string;
  account_identifier: string;
  status: StatutIntegration;
  last_sync_at: string | null;
  connected_at: string | null;
  created_by: string;
  updated_at: string;
  config: Record<string, string>;
}

export interface ChampIntegration {
  cle: string;
  label: string;
  requis?: boolean;
  secret?: boolean;
  placeholder?: string;
}

export interface DefinitionPlateforme {
  platform: Plateforme;
  nom: string;
  display_name: string;
  description: string;
  instructions: string[];
  champs: ChampIntegration[];
  champCompte: string;
  champIdentifiant: string;
  usages: string[];
  usagesFuturs: string[];
}

export const DEFINITIONS: DefinitionPlateforme[] = [
  {
    platform: "WHATSAPP",
    nom: "WhatsApp",
    display_name: "WhatsApp Business",
    description:
      "Connectez WhatsApp Business pour permettre à l’Agent IA de répondre aux prospects et clients.",
    instructions: [
      "Accédez à votre compte Meta Business.",
      "Vérifiez que votre numéro WhatsApp Business est bien rattaché à votre compte.",
      "Créez ou sélectionnez l’application Meta utilisée pour l’intégration.",
      "Récupérez les identifiants nécessaires.",
      "Copiez-les dans les champs ci-dessous.",
    ],
    champs: [
      { cle: "nom_connexion", label: "Nom de la connexion", requis: true, placeholder: "SINMAT — WhatsApp production" },
      { cle: "compte", label: "Nom du compte WhatsApp Business", requis: true, placeholder: "SINMAT Business" },
      { cle: "phone_number_id", label: "Phone Number ID", requis: true, placeholder: "1234567890" },
      { cle: "waba_id", label: "WhatsApp Business Account ID", requis: true, placeholder: "9876543210" },
      { cle: "access_token", label: "Access Token", requis: true, secret: true },
      { cle: "webhook_verify_token", label: "Webhook Verify Token" },
      { cle: "app_id", label: "App ID" },
      { cle: "app_secret", label: "App Secret", secret: true },
      { cle: "numero", label: "Numéro WhatsApp", placeholder: "+212 6 12 34 56 78" },
      { cle: "business_manager_id", label: "Business Manager ID" },
    ],
    champCompte: "compte",
    champIdentifiant: "numero",
    usages: ["Agent IA Commercial", "Qualification Vente / Location", "Notifications clients"],
    usagesFuturs: ["Messages entrants", "Qualification client", "Service client"],
  },
  {
    platform: "INSTAGRAM",
    nom: "Instagram",
    display_name: "Instagram",
    description:
      "Connectez votre compte Instagram professionnel pour centraliser les messages et interactions clients.",
    instructions: [
      "Accédez à votre compte Meta Business.",
      "Vérifiez que votre compte Instagram est bien en mode professionnel.",
      "Reliez le compte Instagram à votre page Facebook.",
      "Récupérez les identifiants dans l’application Meta.",
      "Copiez-les dans les champs ci-dessous.",
    ],
    champs: [
      { cle: "nom_connexion", label: "Nom de la connexion", requis: true, placeholder: "SINMAT — Instagram" },
      { cle: "compte", label: "Compte Instagram professionnel", requis: true, placeholder: "@sinmat_maroc" },
      { cle: "instagram_account_id", label: "Instagram Account ID", requis: true },
      { cle: "facebook_page_id", label: "Facebook Page ID associée", requis: true },
      { cle: "access_token", label: "Access Token", requis: true, secret: true },
      { cle: "app_id", label: "App ID" },
      { cle: "app_secret", label: "App Secret", secret: true },
      { cle: "webhook_verify_token", label: "Webhook Verify Token" },
      { cle: "business_manager_id", label: "Business Manager ID" },
    ],
    champCompte: "compte",
    champIdentifiant: "instagram_account_id",
    usages: ["Agent IA Commercial", "Qualification client"],
    usagesFuturs: ["Messages entrants", "Qualification client", "Service client"],
  },
  {
    platform: "FACEBOOK",
    nom: "Facebook",
    display_name: "Facebook",
    description:
      "Connectez votre page Facebook pour permettre la gestion des échanges clients depuis la plateforme.",
    instructions: [
      "Accédez à votre compte Meta Business.",
      "Sélectionnez la page Facebook utilisée par SINMAT.",
      "Créez ou sélectionnez l’application Meta utilisée pour l’intégration.",
      "Générez un Page Access Token de longue durée.",
      "Copiez les identifiants dans les champs ci-dessous.",
    ],
    champs: [
      { cle: "nom_connexion", label: "Nom de la connexion", requis: true, placeholder: "SINMAT — Page Facebook" },
      { cle: "compte", label: "Nom de la page Facebook", requis: true, placeholder: "SINMAT Maroc" },
      { cle: "facebook_page_id", label: "Facebook Page ID", requis: true },
      { cle: "page_access_token", label: "Page Access Token", requis: true, secret: true },
      { cle: "app_id", label: "App ID" },
      { cle: "app_secret", label: "App Secret", secret: true },
      { cle: "webhook_verify_token", label: "Webhook Verify Token" },
      { cle: "business_manager_id", label: "Business Manager ID" },
    ],
    champCompte: "compte",
    champIdentifiant: "facebook_page_id",
    usages: ["Agent IA Commercial", "Service client"],
    usagesFuturs: ["Messages entrants", "Qualification client", "Service client"],
  },
];

export const DEFINITION = (p: Plateforme) => DEFINITIONS.find((d) => d.platform === p)!;

const CLE_STOCKAGE = "sinmat.integrations.v1";

function parDefaut(): Integration[] {
  const base = (platform: Plateforme): Integration => ({
    id: platform.toLowerCase(),
    platform,
    display_name: DEFINITION(platform).display_name,
    account_name: "",
    account_identifier: "",
    status: "DISCONNECTED",
    last_sync_at: null,
    connected_at: null,
    created_by: "Houda Bennani",
    updated_at: new Date().toISOString(),
    config: {},
  });

  const whatsapp: Integration = {
    ...base("WHATSAPP"),
    account_name: "SINMAT Business",
    account_identifier: "+212 6 12 34 56 78",
    status: "CONNECTED",
    last_sync_at: new Date().toISOString(),
    connected_at: "2026-08-02T09:15:00.000Z",
    config: {
      nom_connexion: "SINMAT — WhatsApp production",
      compte: "SINMAT Business",
      phone_number_id: "108452398765432",
      waba_id: "204518976543210",
      access_token: "EAAG•••••••••••••••••",
      webhook_verify_token: "sinmat-verify-2026",
      app_id: "1029384756102938",
      app_secret: "••••••••••••••••",
      numero: "+212 6 12 34 56 78",
      business_manager_id: "5647382910",
    },
  };

  return [whatsapp, base("INSTAGRAM"), base("FACEBOOK")];
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(parDefaut);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE_STOCKAGE);
      if (brut) setIntegrations(JSON.parse(brut) as Integration[]);
    } catch {
      /* stockage indisponible */
    }
    setCharge(true);
  }, []);

  const persister = useCallback((suivant: Integration[]) => {
    setIntegrations(suivant);
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(suivant));
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const majIntegration = useCallback(
    (platform: Plateforme, patch: Partial<Integration>) => {
      setIntegrations((actuelles) => {
        const suivant = actuelles.map((i) =>
          i.platform === platform ? { ...i, ...patch, updated_at: new Date().toISOString() } : i,
        );
        try {
          window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(suivant));
        } catch {
          /* stockage indisponible */
        }
        return suivant;
      });
    },
    [],
  );

  return { integrations, charge, majIntegration, persister };
}

export function formaterDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formaterHeure(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "À l’instant";
  if (diff < 3_600_000) return `Il y a ${Math.round(diff / 60_000)} min`;
  const memeJour = d.toDateString() === new Date().toDateString();
  const heure = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return memeJour ? `Aujourd’hui à ${heure}` : `${formaterDate(iso)} à ${heure}`;
}
