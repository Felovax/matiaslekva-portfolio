// Informasjon om meg. Brukes i header, toppseksjonen, Om meg og Kontakt.
// Vil du endre en tekst på siden, er det her (og i de andre filene i src/data/)
// du gjør det, ikke i komponentene.

export const profil = {
  navn: 'Matias Lekva',
  hovedbudskap:
    'Jeg bygger backend og databaser der riktige personer får tilgang til riktige data.',
  intro:
    'Siste år på bachelor i IT og informasjonssystemer ved UiA. Jeg ser etter fast jobb innen backend, database eller cybersikkerhet fra sommeren 2027.',
  omMeg: [
    'Jeg er 23 år, fra Bergen, og går siste år på bachelor i IT og informasjonssystemer ved Universitetet i Agder. Jeg er ferdig sommeren 2027.',
    'Jeg er mest interessert i det som skjer bak skjermen: hvordan data lagres, og hvem som får se og endre hva. I Cmpera, et bookingsystem jeg bygger sammen med en forretningspartner, jobber jeg med databasen og tilgangsstyringen, slik at hver campingplass bare ser sine egne data.',
    'Akkurat nå jobber jeg med å få på plass et partnerskap med en betalingsleverandør, og med adaptere mot ulike regnskapssystemer. Målet er at Cmpera skal kunne kobles til de systemene campingplassene allerede bruker, i stedet for at de må bytte.',
    'Det meste jeg har laget, har hatt ekte brukere eller oppdragsgivere. I studiet har jeg jobbet i team på prosjekter for Kartverket, Norsk Luftambulanse og Norkart, og Cmpera utvikler vi tett sammen med en campingplass.',
    'Jeg har jobbet i hjemmesykepleien i over tre år, de siste to ved siden av studiet. Der er taushetsplikt og ansvar for sensitive opplysninger en del av hverdagen. Interessen for sikkerhet har jeg fulgt opp med kurs i cybersikkerhet og nettverk gjennom Cisco Networking Academy.',
  ],
  epost: 'matiaslekva@hotmail.com',
  github: 'https://github.com/Felovax',
  linkedin: 'https://www.linkedin.com/in/matias-lekva-15a6823b8/',
};

export interface Teknologigruppe {
  kategori: string;
  teknologier: string[];
}

export const teknologi: Teknologigruppe[] = [
  { kategori: 'Språk', teknologier: ['Python', 'C#', 'TypeScript', 'JavaScript', 'SQL'] },
  { kategori: 'Backend', teknologier: ['ASP.NET Core', 'FastAPI', 'Supabase Edge Functions'] },
  {
    kategori: 'Database',
    teknologier: ['PostgreSQL', 'PostGIS', 'MariaDB', 'Row Level Security', 'Entity Framework'],
  },
  { kategori: 'Frontend', teknologier: ['Next.js', 'React', 'Vite'] },
  { kategori: 'Verktøy', teknologier: ['Git og GitHub', 'GitHub Actions', 'Docker', 'WordPress'] },
];
