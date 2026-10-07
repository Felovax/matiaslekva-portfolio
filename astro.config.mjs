// @ts-check
import { defineConfig } from 'astro/config';

// Siden publiseres på https://felovax.github.io/matiaslekva-portfolio/
// site = domenet, base = undermappen repoet får på GitHub Pages.
// Får vi eget domene senere, fjerner vi base.
// https://astro.build/config
export default defineConfig({
  site: 'https://felovax.github.io',
  base: '/matiaslekva-portfolio',
});
