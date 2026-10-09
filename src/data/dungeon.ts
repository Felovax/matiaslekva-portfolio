// Tekstene i dungeonen. Bokstavene (O, P, E, K, g, l) er de samme som i kartet
// i src/game/kart.ts.
import { profil } from './profil';

// Dørene. seksjon er id-en til delen av siden døren fører til.
export const DORER: Record<string, { navn: string; seksjon: string }> = {
  O: { navn: 'Om meg', seksjon: 'om-meg' },
  P: { navn: 'Prosjekter', seksjon: 'prosjekter' },
  E: { navn: 'Erfaring', seksjon: 'erfaring' },
  K: { navn: 'Kontakt', seksjon: 'kontakt' },
};

// Portalene åpner profilene i en ny fane
export const PORTALER: Record<string, { navn: string; url: string }> = {
  g: { navn: 'GitHub', url: profil.github },
  l: { navn: 'LinkedIn', url: profil.linkedin },
};

// Skjelettene, i den rekkefølgen S-ene står i kartet (rad for rad, fra venstre).
// melding vises når skjelettet er beseiret, etterfulgt av «+10 XP».
export const SKJELETTER = [
  { navn: 'Legacy Code', melding: 'Legacy-kode fjernet.' },
  { navn: 'NullReferenceException', melding: 'Exception håndtert.' },
  { navn: 'Works On My Machine', melding: 'Fungerer på din maskin også nå.' },
  { navn: 'Merge Conflict', melding: 'Merge-konflikt løst.' },
  { navn: 'SQL Injection', melding: 'Input validert. Spørringen er parameterisert.' },
  { navn: 'Technical Debt', melding: 'Teknisk gjeld nedbetalt.' },
];

export const QUESTLOGG = {
  hovedoppdrag: 'Bli en bedre utvikler.',
  sideoppdrag: [
    { tekst: 'Bygge ting', ferdig: true },
    { tekst: 'Ødelegge ting', ferdig: true },
    { tekst: 'Fikse ting', ferdig: true },
    { tekst: 'Finne ut hvorfor det fungerte', ferdig: false },
  ],
};
