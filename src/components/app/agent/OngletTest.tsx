import { useMemo, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panneau, Statut } from "@/components/app/ui-kit";
import type { ConfigAgent, SourceConnaissance } from "@/lib/agent-ia";
import { detecterLangue, type Langue } from "@/lib/agent-ia";
import { calculerLocation, formatDH, libellePalier, type Produit, type RegleProduit } from "@/data/sinmat";

interface MessageTest {
  id: string;
  role: "client" | "agent";
  texte: string;
}

interface Analyse {
  langue: Langue;
  intention: string;
  produit: string;
  quantite: string;
  duree: string;
  ville: string;
  qualification: string;
  prochaineQuestion: string;
  sources: { source: string; detail: string }[];
}

const VILLES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Agadir",
  "Fès",
  "Kénitra",
  "Oujda",
  "Safi",
  "Meknès",
  "Tétouan",
  "El Jadida",
];

function motsProduit(p: Produit) {
  return `${p.nom} ${p.categorie} ${p.reference}`.toLowerCase();
}

function analyser(
  message: string,
  produits: Produit[],
  regles: RegleProduit[],
  sources: SourceConnaissance[],
): { analyse: Analyse; reponse: string } {
  const t = message.toLowerCase();
  const langue = detecterLangue(message);

  const location = /lou(er|ons)|location|kri|nkri|rent/.test(t);
  const vente = /achet|achat|vendre|vente|buy|purchase|chri/.test(t);
  const intention = location ? "Location" : vente ? "Vente" : "À identifier";

  const produit =
    produits.find((p) =>
      motsProduit(p)
        .split(/[\s—-]+/)
        .some((mot) => mot.length > 4 && t.includes(mot)),
    ) ?? null;

  const mDuree = t.match(/(\d+)\s*(jours?|iyam|days?|j\b)/);
  const duree = mDuree ? `${mDuree[1]} jours` : "À demander";
  const mQte = t.match(/(\d+)\s*(unit[eé]s?|machines?|engins?)/);
  const quantite = mQte ? `${mQte[1]}` : "À demander";
  const ville = VILLES.find((v) => t.includes(v.toLowerCase())) ?? "À demander";

  const regle = produit ? regles.find((r) => r.produitId === produit.id) : undefined;
  const jours = mDuree ? Number(mDuree[1]) : 0;
  const calcul = regle && jours > 0 ? calculerLocation(regle.paliersLocation, jours, Number(quantite) || 1) : null;

  const manquants: string[] = [];
  if (!produit) manquants.push("produit");
  if (quantite === "À demander") manquants.push("quantité");
  if (intention === "Location" && duree === "À demander") manquants.push("durée");
  if (ville === "À demander") manquants.push("ville");

  const prochaineQuestion =
    manquants[0] === "produit"
      ? "Quel type de matériel recherchez-vous ?"
      : manquants[0] === "quantité"
        ? `Combien de ${produit ? produit.nom.toLowerCase() : "machines"} souhaitez-vous ${intention === "Vente" ? "acheter" : "louer"} ?`
        : manquants[0] === "durée"
          ? "Sur quelle durée souhaitez-vous la location ?"
          : manquants[0] === "ville"
            ? "Dans quelle ville se situe le chantier ?"
            : "Souhaitez-vous que je prépare un devis ?";

  const sourcesUtilisees: { source: string; detail: string }[] = [];
  if (produit) sourcesUtilisees.push({ source: "Catalogue SINMAT", detail: produit.nom });
  if (calcul?.palier)
    sourcesUtilisees.push({ source: "Règles location", detail: `Palier ${libellePalier(calcul.palier)}` });
  const faq = sources.find((s) => s.type === "FAQ" && s.actif);
  if (faq) sourcesUtilisees.push({ source: "FAQ", detail: faq.faq[0]?.question ?? faq.nom });
  const livraison = sources.find((s) => s.categorie === "Livraison" && s.actif);
  if (livraison) sourcesUtilisees.push({ source: "Document", detail: livraison.nom });

  const analyse: Analyse = {
    langue,
    intention,
    produit: produit ? produit.nom : "À identifier",
    quantite,
    duree: intention === "Vente" ? "—" : duree,
    ville,
    qualification: manquants.length === 0 ? "Complète" : "Incomplète",
    prochaineQuestion,
    sources: sourcesUtilisees,
  };

  const contexte = produit
    ? calcul?.palier
      ? `${produit.nom} · ${formatDH(calcul.prixUnitaire)} / jour (palier ${libellePalier(calcul.palier)})`
      : produit.nom
    : "";

  const reponses: Record<Langue, string> = {
    Français: `Bonjour, merci pour votre message.${contexte ? ` Pour ${contexte}, c’est bien noté.` : ""} ${prochaineQuestion}`,
    Darija: `Salam, chokran 3la message dyalk.${contexte ? ` ${contexte} mawjoud.` : ""} ${prochaineQuestion}`,
    العربية: `مرحبا، شكرا على رسالتك.${contexte ? ` ${contexte}.` : ""} ${prochaineQuestion}`,
    English: `Hello, thank you for your message.${contexte ? ` Regarding ${contexte}.` : ""} ${prochaineQuestion}`,
  };

  return { analyse, reponse: reponses[langue] };
}

export function OngletTest({
  config,
  sources,
  produits,
  regles,
}: {
  config: ConfigAgent;
  sources: SourceConnaissance[];
  produits: Produit[];
  regles: RegleProduit[];
}) {
  const [messages, setMessages] = useState<MessageTest[]>([
    { id: "m0", role: "agent", texte: "Bonjour, comment puis-je vous aider ?" },
  ]);
  const [saisie, setSaisie] = useState("");
  const [analyse, setAnalyse] = useState<Analyse | null>(null);

  const exemples = useMemo(
    () => [
      "Je veux louer un compacteur pendant 10 jours à Casablanca.",
      "Bghit nkri compacteur 10 iyam f Casablanca.",
      "Je cherche une mini-pelle à acheter.",
    ],
    [],
  );

  const envoyer = (texte: string) => {
    const message = texte.trim();
    if (!message) return;
    const resultat = analyser(message, produits, regles, sources);
    setMessages((m) => [
      ...m,
      { id: `c${Date.now()}`, role: "client", texte: message },
      { id: `a${Date.now() + 1}`, role: "agent", texte: resultat.reponse },
    ]);
    setAnalyse(resultat.analyse);
    setSaisie("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Panneau
        titre="Simulateur de conversation"
        description={`Testez l’Agent « ${config.nom} » avant sa mise en production.`}
        bodyClassName="p-0"
      >
        <div className="scroll-slim h-[420px] space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "client" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "client"
                    ? "max-w-[78%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-[13px] leading-relaxed text-primary-foreground"
                    : "max-w-[78%] rounded-lg rounded-bl-sm border border-border bg-surface-muted/60 px-3 py-2 text-[13px] leading-relaxed text-foreground"
                }
              >
                <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  {m.role === "client" ? <User className="size-3" /> : <Sparkles className="size-3" />}
                  {m.role === "client" ? "Client" : "Agent IA"}
                </span>
                {m.texte}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {exemples.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => envoyer(e)}
                className="rounded-md bg-muted px-2 py-1 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {e}
              </button>
            ))}
          </div>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              envoyer(saisie);
            }}
          >
            <Input
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder="Écrivez un message test..."
              className="h-9 text-[13px]"
            />
            <Button type="submit" size="sm" className="gap-1.5">
              <Send className="size-3.5" /> Envoyer
            </Button>
          </form>
        </div>
      </Panneau>

      <Panneau titre="Analyse Agent IA" description="Lecture de la demande et sources mobilisées.">
        {!analyse ? (
          <p className="text-[13px] text-muted-foreground">
            Envoyez un message test pour afficher l’analyse de l’Agent.
          </p>
        ) : (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                ["Langue détectée", analyse.langue],
                ["Intention", analyse.intention],
                ["Produit", analyse.produit],
                ["Quantité", analyse.quantite],
                ["Durée", analyse.duree],
                ["Ville", analyse.ville],
              ].map(([label, valeur]) => (
                <div key={label}>
                  <dt className="text-[11.5px] text-muted-foreground">{label}</dt>
                  <dd className="text-[13.5px] font-semibold text-foreground">{valeur}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="text-[12.5px] text-muted-foreground">Qualification</span>
              <Statut
                valeur={analyse.qualification}
                ton={analyse.qualification === "Complète" ? "succes" : "attention"}
              />
            </div>

            <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-3">
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-primary">Prochaine question</p>
              <p className="mt-1 text-[13px] text-foreground/85">{analyse.prochaineQuestion}</p>
            </div>

            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                Sources utilisées
              </p>
              {analyse.sources.length === 0 ? (
                <p className="mt-1 text-[13px] text-muted-foreground">Aucune source mobilisée.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {analyse.sources.map((s) => (
                    <li key={`${s.source}-${s.detail}`} className="rounded-md border border-border px-3 py-2">
                      <p className="text-[12.5px] font-semibold text-foreground">{s.source}</p>
                      <p className="text-[12px] text-muted-foreground">{s.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Panneau>
    </div>
  );
}
