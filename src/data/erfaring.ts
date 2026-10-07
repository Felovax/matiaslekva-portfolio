// Arbeidserfaring og kurs, i den rekkefølgen de vises på siden.

import type { Lenke } from './prosjekter';

export interface Erfaring {
  tittel: string;
  periode: string;
  beskrivelse: string;
  punkter: string[];
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
    tittel: 'Hjemmesykepleien',
    periode: '3 år, pågår',
    beskrivelse: 'Ved siden av studiet.',
    punkter: ['Arbeid med pasienter og sensitive helseopplysninger under taushetsplikt'],
  },
];

export interface Kurs {
  navn: string;
  utsteder: string;
  status?: string;
}

export const kurs: Kurs[] = [
  { navn: 'Introduction to Cybersecurity', utsteder: 'Cisco Networking Academy' },
  { navn: 'Networking Basics', utsteder: 'Cisco Networking Academy', status: 'Pågår' },
];
