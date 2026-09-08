import { useEffect, useState, type ReactNode } from "react";
import { Download, FileText, Maximize2, Printer } from "lucide-react";

import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDH, formatDate } from "@/data/sinmat";

export interface LignePDF {
  designation: string;
  reference?: string | undefined;
  quantite: number;
  duree?: string | undefined;
  prixUnitaire: number;
  total: number;
}

export interface DocumentPDF {
  type: "Devis" | "Facture" | "Bon de livraison";
  reference: string;
  date: string;
  echeance?: string | undefined;
  echeanceLabel?: string | undefined;
  client: { nom: string; adresse?: string | undefined; ville?: string | undefined; ice?: string | undefined; contact?: string | undefined };
  lignes: LignePDF[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  conditions?: string | undefined;
  mentions?: string | undefined;
}

const SOCIETE = {
  nom: "SINMAT",
  activite: "Matériel & outillage de chantier — Vente et location",
  adresse: "Zone industrielle, Casablanca, Maroc",
  contact: "contact@sinmat.ma · +212 5 22 00 00 00",
  ice: "ICE 002458796000047",
};

function ApercuDocument({ doc }: { doc: DocumentPDF }) {
  return (
    <div
      id="apercu-pdf"
      className="mx-auto w-full max-w-[794px] bg-white p-10 text-[12px] leading-relaxed text-[#1d2b33] shadow-sm"
    >
      <div className="flex items-start justify-between border-b-2 border-[#f47d3e] pb-5">
        <div>
          <p className="font-display text-[24px] font-bold tracking-[0.16em] text-[#1d2b33]">
            SINMAT
          </p>
          <p className="mt-1 text-[11px] text-[#59646a]">{SOCIETE.activite}</p>
          <p className="mt-2 text-[11px] text-[#59646a]">{SOCIETE.adresse}</p>
          <p className="text-[11px] text-[#59646a]">{SOCIETE.contact}</p>
          <p className="text-[11px] text-[#59646a]">{SOCIETE.ice}</p>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-bold uppercase text-[#f47d3e]">{doc.type}</p>
          <p className="mt-1 font-semibold">{doc.reference}</p>
          <p className="text-[11px] text-[#59646a]">Date : {formatDate(doc.date)}</p>
          {doc.echeance && (
            <p className="text-[11px] text-[#59646a]">
              {doc.echeanceLabel ?? "Échéance"} : {formatDate(doc.echeance)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 w-1/2 rounded border border-[#e3e7e9] bg-[#f7f8f9] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#59646a]">Client</p>
        <p className="mt-1 font-semibold">{doc.client.nom}</p>
        {doc.client.contact && <p className="text-[11px]">{doc.client.contact}</p>}
        {doc.client.adresse && <p className="text-[11px]">{doc.client.adresse}</p>}
        {doc.client.ville && <p className="text-[11px]">{doc.client.ville}</p>}
        {doc.client.ice && <p className="text-[11px]">ICE : {doc.client.ice}</p>}
      </div>

      <table className="mt-6 w-full border-collapse text-[11.5px]">
        <thead>
          <tr className="bg-[#36434a] text-white">
            <th className="p-2 text-left font-semibold">Désignation</th>
            <th className="p-2 text-right font-semibold">Qté</th>
            <th className="p-2 text-right font-semibold">Durée</th>
            <th className="p-2 text-right font-semibold">P.U. HT</th>
            <th className="p-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {doc.lignes.map((l, i) => (
            <tr key={i} className="border-b border-[#e3e7e9]">
              <td className="p-2">
                <span className="font-semibold">{l.designation}</span>
                {l.reference && <span className="block text-[10px] text-[#59646a]">{l.reference}</span>}
              </td>
              <td className="p-2 text-right">{l.quantite}</td>
              <td className="p-2 text-right">{l.duree ?? "—"}</td>
              <td className="p-2 text-right">{formatDH(l.prixUnitaire)}</td>
              <td className="p-2 text-right font-semibold">{formatDH(l.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 flex justify-end">
        <div className="w-[260px] space-y-1.5">
          <div className="flex justify-between text-[11.5px]">
            <span className="text-[#59646a]">Total HT</span>
            <span className="font-semibold">{formatDH(doc.totalHT)}</span>
          </div>
          <div className="flex justify-between text-[11.5px]">
            <span className="text-[#59646a]">TVA (20 %)</span>
            <span className="font-semibold">{formatDH(doc.totalTVA)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-[#f47d3e] pt-2 text-[13px]">
            <span className="font-bold">Total TTC</span>
            <span className="font-bold text-[#f47d3e]">{formatDH(doc.totalTTC)}</span>
          </div>
        </div>
      </div>

      {doc.conditions && (
        <div className="mt-6 rounded border border-[#e3e7e9] p-3 text-[11px]">
          <p className="font-semibold">Conditions</p>
          <p className="mt-1 text-[#59646a]">{doc.conditions}</p>
        </div>
      )}

      <p className="mt-6 border-t border-[#e3e7e9] pt-3 text-center text-[10px] text-[#59646a]">
        {doc.mentions ?? "SINMAT — Document généré depuis la plateforme de gestion SINMAT."}
      </p>
    </div>
  );
}

function genererPdf(doc: DocumentPDF) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const M = 42;
  let y = 56;

  pdf.setTextColor(29, 43, 51);
  pdf.setFont("helvetica", "bold").setFontSize(22).text("SINMAT", M, y);
  pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(89, 100, 106);
  pdf.text(SOCIETE.activite, M, y + 14);
  pdf.text(SOCIETE.adresse, M, y + 26);
  pdf.text(SOCIETE.contact, M, y + 38);
  pdf.text(SOCIETE.ice, M, y + 50);

  pdf.setTextColor(244, 125, 62).setFont("helvetica", "bold").setFontSize(16);
  pdf.text(doc.type.toUpperCase(), 553, y, { align: "right" });
  pdf.setTextColor(29, 43, 51).setFontSize(11);
  pdf.text(doc.reference, 553, y + 16, { align: "right" });
  pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(89, 100, 106);
  pdf.text(`Date : ${formatDate(doc.date)}`, 553, y + 30, { align: "right" });
  if (doc.echeance)
    pdf.text(`${doc.echeanceLabel ?? "Échéance"} : ${formatDate(doc.echeance)}`, 553, y + 42, { align: "right" });

  y += 72;
  pdf.setDrawColor(244, 125, 62).setLineWidth(1.5).line(M, y, 553, y);

  y += 26;
  pdf.setTextColor(29, 43, 51).setFont("helvetica", "bold").setFontSize(10).text("CLIENT", M, y);
  pdf.setFont("helvetica", "normal").setFontSize(10);
  y += 14;
  [doc.client.nom, doc.client.contact, doc.client.adresse, doc.client.ville, doc.client.ice ? `ICE : ${doc.client.ice}` : ""]
    .filter(Boolean)
    .forEach((l) => {
      pdf.text(String(l), M, y);
      y += 13;
    });

  y += 14;
  pdf.setFillColor(54, 67, 74).rect(M, y - 12, 511, 20, "F");
  pdf.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(9);
  pdf.text("Désignation", M + 6, y + 2);
  pdf.text("Qté", 330, y + 2, { align: "right" });
  pdf.text("Durée", 395, y + 2, { align: "right" });
  pdf.text("P.U. HT", 470, y + 2, { align: "right" });
  pdf.text("Total", 547, y + 2, { align: "right" });
  y += 22;

  pdf.setTextColor(29, 43, 51).setFont("helvetica", "normal").setFontSize(9);
  doc.lignes.forEach((l) => {
    const nom = pdf.splitTextToSize(l.designation, 240) as string[];
    pdf.text(nom, M + 6, y);
    pdf.text(String(l.quantite), 330, y, { align: "right" });
    pdf.text(l.duree ?? "—", 395, y, { align: "right" });
    pdf.text(formatDH(l.prixUnitaire), 470, y, { align: "right" });
    pdf.text(formatDH(l.total), 547, y, { align: "right" });
    y += Math.max(16, nom.length * 12);
    pdf.setDrawColor(227, 231, 233).setLineWidth(0.5).line(M, y - 6, 553, y - 6);
    if (y > 720) {
      pdf.addPage();
      y = 60;
    }
  });

  y += 14;
  pdf.setFontSize(10);
  pdf.text("Total HT", 470, y, { align: "right" });
  pdf.text(formatDH(doc.totalHT), 553, y, { align: "right" });
  pdf.text("TVA (20 %)", 470, y + 15, { align: "right" });
  pdf.text(formatDH(doc.totalTVA), 553, y + 15, { align: "right" });
  pdf.setFont("helvetica", "bold").setFontSize(12).setTextColor(244, 125, 62);
  pdf.text("Total TTC", 470, y + 36, { align: "right" });
  pdf.text(formatDH(doc.totalTTC), 553, y + 36, { align: "right" });

  if (doc.conditions) {
    pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(89, 100, 106);
    const c = pdf.splitTextToSize(`Conditions : ${doc.conditions}`, 511) as string[];
    pdf.text(c, M, y + 66);
  }
  pdf.setFontSize(8).setTextColor(89, 100, 106);
  pdf.text(doc.mentions ?? "SINMAT — Document généré depuis la plateforme de gestion SINMAT.", 297, 800, {
    align: "center",
  });
  return pdf;
}

/** Génère le PDF réel et retourne une URL blob (régénérée à chaque changement du document). */
export function useUrlPdf(doc: DocumentPDF) {
  const cle = JSON.stringify(doc);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let actif = true;
    let courante = "";
    try {
      courante = genererPdf(doc).output("bloburl") as unknown as string;
      if (actif) setUrl(courante);
    } catch {
      toast.error("Génération du PDF impossible");
    }
    return () => {
      actif = false;
      if (courante) URL.revokeObjectURL(courante);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);

  return url;
}

export function telechargerDocument(doc: DocumentPDF) {
  genererPdf(doc).save(`${doc.reference}.pdf`);
}

export function imprimerDocument(doc: DocumentPDF) {
  const pdf = genererPdf(doc);
  pdf.autoPrint();
  window.open(pdf.output("bloburl") as unknown as string, "_blank");
}

/** Lecteur PDF intégré : affiche le fichier réellement généré. */
export function LecteurPDF({
  doc,
  hauteur = 720,
  titre,
}: {
  doc: DocumentPDF;
  hauteur?: number;
  titre?: string;
}) {
  const url = useUrlPdf(doc);
  const [pleinEcran, setPleinEcran] = useState(false);

  const barre = (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted/60 px-4 py-2.5">
      <span className="text-[13px] font-semibold text-foreground">
        {titre ?? `${doc.type} ${doc.reference}`}
      </span>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setPleinEcran(true)}>
          <Maximize2 className="size-4" /> Plein écran
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => imprimerDocument(doc)}>
          <Printer className="size-4" /> Imprimer
        </Button>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            telechargerDocument(doc);
            toast.success("PDF téléchargé", { description: `${doc.type} ${doc.reference}` });
          }}
        >
          <Download className="size-4" /> Télécharger
        </Button>
      </div>
    </div>
  );

  const cadre = (h: number | string) =>
    url ? (
      <object
        data={`${url}#view=FitH`}
        type="application/pdf"
        title={`${doc.type} ${doc.reference}`}
        className="w-full bg-[#525659]"
        style={{ height: typeof h === "number" ? `${h}px` : h }}
      >
        <div className="max-h-full overflow-auto bg-[#525659] p-4">
          <ApercuDocument doc={doc} />
        </div>
      </object>
    ) : (

      <div
        className="flex items-center justify-center bg-surface-muted text-[13px] text-muted-foreground"
        style={{ height: typeof h === "number" ? `${h}px` : h }}
      >
        Génération du document en cours…
      </div>
    );

  return (
    <>
      <div className="panel overflow-hidden p-0">
        {barre}
        {cadre(hauteur)}
      </div>

      <Dialog open={pleinEcran} onOpenChange={setPleinEcran}>
        <DialogContent className="h-[95vh] max-w-[1200px] gap-0 overflow-hidden p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle className="text-[14px]">
              {doc.type} {doc.reference}
            </DialogTitle>
          </DialogHeader>
          {cadre("calc(95vh - 56px)")}
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Bouton + boîte de dialogue affichant le PDF réel. */
export function VisionneuseDocument({
  doc,
  declencheur,
}: {
  doc: DocumentPDF;
  declencheur?: ReactNode;
}) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <Dialog open={ouvert} onOpenChange={setOuvert}>
      <DialogTrigger asChild>
        {declencheur ?? (
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="size-3.5" /> Voir le PDF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-[92vh] max-w-[1000px] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="text-[14px]">
            {doc.type} {doc.reference}
          </DialogTitle>
        </DialogHeader>
        <div className="h-[calc(92vh-56px)] overflow-auto p-4">
          {ouvert && <LecteurPDF doc={doc} hauteur={720} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ApercuDocument, genererPdf };

