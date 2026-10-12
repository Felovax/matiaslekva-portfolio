// Arbeidserfaring og kurs, i den rekkefølgen de vises på siden (nyeste først).
// Jobbene er de samme som på LinkedIn, så siden og LinkedIn sier det samme.

import type { Lenke } from './prosjekter';

export interface Erfaring {
  tittel: string;
  periode: string;
  beskrivelse: string;
  // Valgfritt: vises bare hvis det finnes punkter
  punkter?: string[];
  lenke?: Lenke;
}

export const erfaring: Erfaring[] = [
  {
    tittel: 'Praksis hos E-Waves',
    periode: 'Aug.–des. 2026',
    beskrivelse: 'E-Waves er et nettverk for e-handelsbedrifter.',
    punkter: [
      'Lager ny nettside for nettverket i WordPress, sammen med en medstudent fra UiA',
      'Videreutvikler Wavey, en kunnskapsdatabase med chatbot for medlemmene (Python, Flask og Google Gemini), påbegynt i tidligere studenters bacheloroppgave',
    ],
    lenke: { tekst: 'ewaves.no', url: 'https://ewaves.no' },
  },
  {
    tittel: 'Pleie- og omsorgsassistent, Kristiansand kommune',
    periode: 'Sep. 2024 – nå',
    beskrivelse: 'Hjemmesykepleien, deltid ved siden av studiet.',
    punkter: ['Arbeid med pasienter og sensitive helseopplysninger under taushetsplikt'],
  },
  {
    tittel: "Salgsmedarbeider, McDonald's",
    periode: 'Jun. 2023 – aug. 2024',
    beskrivelse: 'Deltid i Bergen.',
  },
  {
    tittel: 'Pleie- og omsorgsassistent, Voss herad',
    periode: 'Mai 2022 – jun. 2023',
    beskrivelse: 'Hjemmesykepleien, deltid.',
  },
];

export interface Kurs {
  navn: string;
  utsteder: string;
  status?: string;
}

export const kurs: Kurs[] = [
  { navn: 'Introduction to Cybersecurity', utsteder: 'Cisco Networking Academy' },
  { navn: 'Networking Basics', utsteder: 'Cisco Networking Academy' },
];
