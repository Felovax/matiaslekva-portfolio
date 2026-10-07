# matiaslekva-portfolio

Personlig portefølje for Matias Lekva, med en liten pikseldungeon som valgfri,
alternativ navigasjon.

**Se siden:** https://felovax.github.io/matiaslekva-portfolio/

Bygget med [Astro](https://astro.build) og TypeScript. Beslutninger, innhold og
faser ligger i [docs/plan.md](docs/plan.md).

## Kjøre lokalt

```bash
npm install
npm run dev      # utviklingsserver på http://localhost:4321/matiaslekva-portfolio/
npm run check    # typesjekk
npm run build    # bygger den ferdige siden til dist/
npm run preview  # viser den bygde siden lokalt
```

## Publisering

Hver push til `main` bygger og publiserer siden automatisk med GitHub Actions
(`.github/workflows/deploy.yml`). Typefeil stopper publiseringen.

## Struktur

```
src/
  pages/index.astro   siden (setter sammen komponentene)
  layouts/            felles <html>-ramme
  components/         Header, Seksjon, ProsjektKort, Footer
  data/               alt innholdet; endre tekst her
  styles/global.css   farger og grunnstil
public/               filer som kopieres uendret (favicon)
docs/plan.md          plan og beslutninger
```
