// Har brukeren bedt om mindre bevegelse i systemet sitt (f.eks. fordi animasjoner
// gir svimmelhet)? Da flimrer ikke faklene, og overganger hoppes over.
//
// matchMedia lages én gang. .matches leses hver gang vi spør, så svaret er riktig
// også hvis brukeren endrer innstillingen mens siden er åpen.
const sporring = window.matchMedia('(prefers-reduced-motion: reduce)');

export function onskerMindreBevegelse(): boolean {
  return sporring.matches;
}
