## Prosjektet

Personlig portefølje for Matias Lekva, med en pikseldungeon som valgfri navigasjon.
Beslutninger, innhold og faser står i `docs/plan.md`. Les den før du gjør endringer.

- Siden er på norsk. Kommentarer i koden skrives på norsk og forklarer *hvorfor*.
- Innholdet (all tekst) ligger i `src/data/`. Endre det der, ikke i komponentene.
- Matias vil lære av prosjektet: jobb i små steg, si hvilke filer som lages eller
  endres før større endringer, forklar viktige valg, og la ham teste før commit.
- **Git:** Matias committer og pusher selv. Kjør aldri `git commit` eller
  `git push`. Foreslå heller en commit-melding når et steg er ferdig.
- **Spilldelen (fase 2–5):** Matias vil forstå hvordan spillet kodes, godt nok til
  å forklare koden i et intervju. Han er ny til TypeScript og skriver ikke koden
  selv. Claude skriver koden, bit for bit, og forklarer hver del grundig: hva
  den gjør, hvorfor den er skrevet slik, og gjerne et gjennomløp med konkrete tall.
- Ikke fabriker eller overdriv erfaring eller prosjekter i innholdet.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
