# Plan for porteføljen

Beslutninger, innhold og faser for porteføljen. Oppdateres underveis.

## Prinsipp

Porteføljen kommer først, spillet etter. En rekrutterer skal finne prosjekter,
erfaring, GitHub, LinkedIn og kontaktinfo på sekunder, uten å røre dungeonen.
Dungeonen er valgfri, rask å forstå (30–60 sekunder) og gjør siden minneverdig.

## Om Matias

- 23 år, fra Bergen
- Siste år på bachelor i IT og informasjonssystemer ved UiA, ferdig sommeren 2027
- Ser etter fast jobb innen cybersikkerhet, database eller backend
- Siden skrives på norsk

**Hovedbudskap:**
> Jeg bygger backend og databaser der riktige personer får tilgang til riktige data.

**Lenker:**
- E-post: matiaslekva@hotmail.com
- GitHub: https://github.com/Felovax
- LinkedIn: https://www.linkedin.com/in/matias-lekva-15a6823b8/

## Innhold (utkast, finpusses i fase 1)

Prosjektene vises som oversiktskort, ikke egne case-studier. Dybden tas i intervju.

### Prosjekter (i denne rekkefølgen)

**1. Cmpera**: Bookingsystem for campingplasser
- Under utvikling og i pilotfase siden august 2026, sammen med Vegard (forretningspartner)
- Teknologi: Next.js, TypeScript, Supabase (PostgreSQL), Row Level Security, Edge Functions
- Erfaring med:
  - Datamodell der mange campingplasser deler én database, med dataene holdt adskilt
  - Tilgangsstyring for eiere og ansatte, håndhevet i databasen og ikke bare i grensesnittet
  - Serverlogikk for booking i Edge Functions
- Lenke: https://cmpera.no (koden er privat)
- Ikke nevn pilot-campingplassen ved navn. Skjermbilder kun med testdata.

**2. AOR – Aviation Obstacle Registration**: Rapportering av luftfartshindre
- Gruppeprosjekt ved UiA høsten 2025, i samarbeid med Norsk Luftambulanse og Kartverket
- Teknologi: C#, ASP.NET Core MVC, Entity Framework, MariaDB, Docker
- Erfaring med:
  - Rollebasert tilgangsstyring og innlogging med ASP.NET Core Identity
  - Datamodellering og databasemigrasjoner med Entity Framework
  - Å kjøre app og database i Docker-containere
  - Samarbeid i et større team med Git-branches og pull requests
- Lenke: https://github.com/MGumpen/aor

**3. SafeMap**: Kartanalyse av beredskap i Norge
- Gruppeprosjekt i IS-218 ved UiA i 2026, i samarbeid med Kartverket og Norkart
- Teknologi: Python, FastAPI, PostgreSQL/PostGIS, Docker, GitHub Actions
- Erfaring med:
  - Romlig SQL i PostGIS: avstandsberegning og søk etter nærmeste ressurs
  - Å hente og importere åpne geodata fra norske kilder
  - Automatisk testing, linting og sikkerhetsskanning i CI
- Lenker: https://github.com/MGumpen/safemap og demovideoene i README-en

**4. JobQuestAI**: Samler IT-stillinger fra flere kilder på én side
- Eget prosjekt, bygget alene i oktober 2026
- Teknologi: Python, TypeScript, Vite, GitHub Actions
- Erfaring med:
  - Å hente data fra flere API-er og RSS-feeder og samle dem i ett format
  - Automatisk kjøring og publisering hver natt med GitHub Actions
  - Testing med pytest
- Lenker: https://github.com/Felovax/JobQuestAI og siden på GitHub Pages

### Erfaring

**Praksis hos E-Waves** (august–desember 2026)
E-Waves er et nettverk for e-handelsbedrifter.
- Ny nettside for nettverket i WordPress, sammen med en medstudent fra UiA (https://ewaves.no)
- Videreutvikler Wavey, en kunnskapsdatabase med chatbot for medlemmene, påbegynt i
  tidligere studenters bacheloroppgave. Bygget med Python (Flask) og Google Gemini.

**Hjemmesykepleien** (3 år ved siden av studiet, fortsatt i jobb)
Arbeid med pasienter og sensitive helseopplysninger under taushetsplikt.

### Kurs med kursbevis

- Cisco Networking Academy: Introduction to Cybersecurity
- Cisco Networking Academy: Networking Basics (pågår)

### Teknologi

- **Språk:** Python, C#, TypeScript, JavaScript, SQL
- **Backend:** ASP.NET Core, FastAPI, Supabase Edge Functions
- **Database:** PostgreSQL, PostGIS, MariaDB, Supabase (Row Level Security), Entity Framework
- **Frontend:** Next.js, React, Vite
- **Verktøy:** Git og GitHub, GitHub Actions, Docker, WordPress

## Tekniske beslutninger

- **Astro + TypeScript (strict).** Siden bygges til statisk HTML, og JavaScript lastes
  bare for dungeonen.
- **Dungeonen er en egen liten Canvas-motor i TypeScript**, uten Phaser. Kartet skrives
  som tekst. Meldinger og questlogg vises som HTML oppå spillet.
- **Innhold i typede datafiler** under `src/data/`, felles for siden og dungeonen.
- **Vanlig CSS** med fargevariabler, mørkt tema. Ingen Tailwind.
- **Én side:** dungeonen øverst, alt innhold under. Menyen er alltid synlig.
- **Kontakt** via e-postlenke og LinkedIn, ikke skjema.
- **Mobil prioriteres ikke nå.** Dungeonen skjules på små skjermer, og innholdet er vanlig HTML.
- **Publisering:** GitHub Pages via GitHub Actions.
- **Grafikk:** gratis pikselgrafikk med CC0-lisens (lisensen sjekkes før nedlasting).
- Prosjektet ligger i `C:\dev\matiaslekva-portfolio`, utenfor OneDrive.

## Dungeon

```
###########P###########
#T...................T#
#....S...........S....#
#.....................#
O.......S.....S.......E
#.....................#
x.....S....@Q...S.....#
#T.....g.......l.....T#
###########K###########
```

| Tegn | Hva |
| --- | --- |
| `@` | Start |
| `Q` | Questlogg |
| `P` | Dør: Prosjekter (rett fram fra start) |
| `O` | Dør: Om meg |
| `E` | Dør: Erfaring |
| `K` | Dør: Kontakt |
| `g` / `l` | Portaler til GitHub og LinkedIn (åpnes i ny fane) |
| `S` | Skjeletter (6), kan ikke skade spilleren |
| `T` | Fakler |
| `x` | Sprukket vegg, slå på den for å åpne et hemmelig rom med en gummiand |

23 × 9 ruter. Hele rommet vises samtidig, så vi trenger ikke kamera.

**Kontroller:** WASD/piltaster går, E samhandler og mellomrom slår. En teller viser XP og
antall beseirede skjeletter.

**Skjeletter** (beseires med ett eller to slag):

| Navn | Melding |
| --- | --- |
| Legacy Code | «Legacy-kode fjernet. +10 XP» |
| NullReferenceException | «Exception håndtert.» |
| Works On My Machine | «Fungerer på din maskin også nå.» |
| Merge Conflict | «Merge-konflikt løst.» |
| SQL Injection | «Input validert. Spørringen er parameterisert.» |
| Technical Debt | «Teknisk gjeld nedbetalt.» |

**Påskeegg:**
- Questloggen: «Hovedoppdrag: Bli en bedre utvikler. Sideoppdrag: ☑ Bygge ting ☑ Ødelegge ting ☑ Fikse ting ☐ Finne ut hvorfor det fungerte»
- Gå inn i veggen gang på gang: «Kollisjon oppdaget. Noe fungerer i hvert fall.»
- Stå stille lenge: «Spilleren ser ut til å være AFK.»
- Gummianden: «Forklar problemet ditt høyt.» Litt senere: «…Du fant feilen selv, gjorde du ikke?»
- Alle skjeletter beseiret: «Prestasjon låst opp: Produksjon er feilfri* — *sannsynligvis»

## Faser

Før hver fase: si hvilke filer som lages eller endres. Etter hver fase: Matias tester,
committer og pusher selv.

**Spilldelen (fase 2–5):** Matias vil virkelig forstå hvordan spillet kodes. Motoren
bygges bit for bit med grundige forklaringer, og Matias skriver gjerne deler selv.

- [x] **Fase 0: Oppsett.** Astro-prosjekt, koblet til GitHub-repoet, denne planen.
- [ ] **Fase 1: Den vanlige porteføljen.** Meny, Om meg, Prosjekter, Erfaring og kurs,
  Kontakt, datafiler, mørkt design, publisering på GitHub Pages.
- [ ] **Fase 2: Grunnmuren til dungeonen.** Canvas, spill-løkke, kart med pikselgrafikk,
  bevegelse og kollisjon.
- [ ] **Fase 3: Dungeonen som navigasjon.** «E – Samhandle», dører med overgang,
  questlogg, portaler, «Hopp over dungeonen».
- [ ] **Fase 4: Skjeletter og påskeegg.**
- [ ] **Fase 5: Stemning og finpuss.** Fakkellys, overganger, ytelse, tastaturnavigasjon,
  redusert bevegelse, rydding av GitHub-profilen.
- Senere, hvis ønskelig: mobil, eget domene, egne prosjektsider.

## Åpne spørsmål

- Om meg-teksten: utkast ligger i `src/data/profil.ts`, Matias må lese og godkjenne.
- Valgfritt: din del av Wavey, stillingstittel i hjemmesykepleien.
