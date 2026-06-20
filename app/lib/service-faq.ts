/**
 * Generează întrebări frecvente „answer-first" pentru o pagină de serviciu.
 * Răspunsurile încep direct cu informația utilă (LLM-urile extrag de sus) și
 * sunt țesute cu numele serviciului și datele reale din `siteConfig`.
 *
 * Sunt întrebări generice-utile despre colaborare (durată, evaluare, zonă,
 * preț), nu conținut inventat — același set, contextualizat per serviciu.
 * // TODO: pentru Q&A specific fiecărui serviciu, mută-le în DB (editabile din admin).
 */
import { siteConfig } from "@/app/lib/site-config";

export type ServiceQA = { question: string; answer: string };

export function serviceFaq(serviceTitle: string): ServiceQA[] {
  const t = serviceTitle.toLowerCase();
  const areas = siteConfig.areaServed.filter((a) => a !== "România").join(", ");

  return [
    {
      question: `Cât durează o lucrare de ${t}?`,
      answer: `Durata pentru ${t} depinde de suprafață, tipul solului, accesul la teren și condițiile meteo. După o evaluare la fața locului îți oferim un termen ferm și un grafic de execuție, nu o estimare generică.`,
    },
    {
      question: "Oferiți evaluare la fața locului?",
      answer: `Da. Mergem la teren, măsurăm și analizăm lucrarea înainte de a transmite o ofertă. Așa primești un deviz corect pentru ${t}, fără costuri-surpriză pe parcurs.`,
    },
    {
      question: `În ce zone executați ${t}?`,
      answer: `Lucrăm în ${areas} și în restul țării, în funcție de amploarea proiectului. Pentru deplasări mai lungi stabilim logistica și transportul utilajelor din timp.`,
    },
    {
      question: "Cum primesc o ofertă de preț?",
      answer: `Trimite-ne detaliile proiectului prin formularul de contact sau sună la ${siteConfig.phoneDisplay}. Revenim cu o evaluare tehnică și o ofertă pentru ${t}.`,
    },
  ];
}
