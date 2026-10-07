// Prosjektene som vises på siden, i den rekkefølgen de står her.
// Typen Prosjekt sørger for at alle prosjekter har de samme feltene. Glemmer du
// et felt, sier TypeScript ifra før siden i det hele tatt bygges.

export interface Lenke {
  tekst: string;
  url: string;
}

export interface Prosjekt {
  navn: string;
  /** Én linje om hva prosjektet er */
  undertittel: string;
  /** Hvem, hvor og når */
  kontekst: string;
  teknologi: string[];
  /** Hva prosjektet ga meg erfaring med */
  erfaring: string[];
  lenker: Lenke[];
  /** Kort merknad, for eksempel at koden er privat */
  merknad?: string;
}

export const prosjekter: Prosjekt[] = [
  {
    navn: 'Cmpera',
    undertittel: 'Bookingsystem for campingplasser',
    kontekst: 'Under utvikling sammen med en forretningspartner. I pilotfase siden august 2026.',
    teknologi: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Row Level Security'],
    erfaring: [
      'Datamodell der mange campingplasser deler én database, med dataene holdt adskilt',
      'Tilgangsstyring for eiere og ansatte, håndhevet i databasen og ikke bare i grensesnittet',
      'Serverlogikk for booking i Supabase Edge Functions',
    ],
    lenker: [{ tekst: 'cmpera.no', url: 'https://cmpera.no' }],
    merknad: 'Koden er privat',
  },
  {
    navn: 'AOR',
    undertittel: 'Aviation Obstacle Registration: rapportering av luftfartshindre',
    kontekst:
      'Gruppeprosjekt ved UiA høsten 2025, i samarbeid med Norsk Luftambulanse og Kartverket.',
    teknologi: ['C#', 'ASP.NET Core MVC', 'Entity Framework', 'MariaDB', 'Docker'],
    erfaring: [
      'Rollebasert tilgangsstyring og innlogging med ASP.NET Core Identity',
      'Datamodellering og databasemigrasjoner med Entity Framework',
      'Å kjøre app og database i Docker-containere',
      'Samarbeid i et større team med Git-branches og pull requests',
    ],
    lenker: [{ tekst: 'GitHub', url: 'https://github.com/MGumpen/aor' }],
  },
  {
    navn: 'SafeMap',
    undertittel: 'Kartanalyse av beredskap i Norge',
    kontekst:
      'Gruppeprosjekt i faget IS-218 ved UiA i 2026, i samarbeid med Kartverket og Norkart.',
    teknologi: ['Python', 'FastAPI', 'PostgreSQL', 'PostGIS', 'Docker', 'GitHub Actions'],
    erfaring: [
      'Romlig SQL i PostGIS: avstandsberegning og søk etter nærmeste ressurs',
      'Å hente og importere åpne geodata fra norske kilder',
      'Automatisk testing, linting og sikkerhetsskanning i CI',
    ],
    lenker: [
      { tekst: 'GitHub', url: 'https://github.com/MGumpen/safemap' },
      { tekst: 'Demovideo', url: 'https://github.com/MGumpen/safemap/issues/31' },
    ],
  },
  {
    navn: 'JobQuestAI',
    undertittel: 'Samler IT-stillinger fra flere kilder på én side',
    kontekst: 'Eget prosjekt, bygget alene i oktober 2026.',
    teknologi: ['Python', 'TypeScript', 'Vite', 'GitHub Actions'],
    erfaring: [
      'Å hente data fra flere API-er og RSS-feeder og samle dem i ett format',
      'Automatisk kjøring og publisering hver natt med GitHub Actions',
      'Testing med pytest',
    ],
    lenker: [
      { tekst: 'GitHub', url: 'https://github.com/Felovax/JobQuestAI' },
      { tekst: 'Se siden', url: 'https://felovax.github.io/JobQuestAI/' },
    ],
  },
];
