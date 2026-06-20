/**
 * Reguli de scriere umanizată, adaptate din skill-ul blader/humanizer
 * (https://github.com/blader/humanizer). Sunt injectate direct în promptul de
 * generare a articolului, ca textul să iasă uman din prima, fără un pas separat
 * de rescriere (economie de tokeni). Acoperă cele 33 de tipare ale skill-ului,
 * formulate ca directive de scriere și condensate pentru consum minim de context.
 */
export const HUMANIZER_RULES = `REGULI DE STIL (umanizare, după skill-ul blader/humanizer). Respectă-le pe toate cât scrii:

Conținut: afirmă fapte direct, fără importanță inflată ("moment crucial", "subliniază"). Nu inventa notabilitate sau atribuiri vagi ("experții spun", "studiile arată") fără sursă reală. Fără gerunzii de umplutură ("simbolizând", "reflectând"). Fără secțiuni-șablon "provocări".
Limbaj: evită vocabularul AI (crucial, pivotal, a aprofunda, a spori, durabil, a cultiva, peisaj, a etala, tapiserie, mărturie, a sublinia, vibrant, de fapt, în plus). Folosește "este/are" în loc de "servește drept/dispune de". Fără "nu doar... ci și...". Nu forța înșiruiri de câte trei. Nu cicla sinonime pentru același lucru. Numește actorul în loc de pasiv fără subiect.
Stil: INTERZIS em-dash (—), en-dash (–) și liniuțe duble (--); folosește punct, virgulă, două puncte sau paranteze. Fără bold mecanic și fără liste "**Termen:** explicație". Titluri în stil propoziție, nu Title Case. Fără emoji. Ghilimele drepte.
Comunicare: fără artefacte de chatbot ("sper că ajută", "desigur"), fără disclaimere de cunoaștere, fără ton slugarnic.
Ritm: variază lungimea propozițiilor, taie umplutura ("pentru a" nu "în scopul de a"), un singur calificativ per afirmație, fără concluzii generice optimiste, fără retorică ("adevărata întrebare e"), fără semnalizare ("hai să intrăm în detalii"), începe direct cu fondul. Adaugă detalii concrete, specifice domeniului. Verifică la final: zero em-dash-uri.`;

/** Înlocuiește orice liniuțe lungi rămase în text (plasă de siguranță ieftină). */
export function stripDashes(text: string): string {
  return text.replace(/\s*[—–]\s*/g, ", ").replace(/--/g, ", ");
}
