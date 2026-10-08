// Kartet over dungeonen, skrevet som tekst. Hvert tegn er én rute.
// Endrer du kartet her, endrer dungeonen seg. Alle rader må være like lange.
//
//   #  vegg              .  gulv
//   P  dør: Prosjekter   O  dør: Om meg
//   E  dør: Erfaring     K  dør: Kontakt
//   @  start             Q  questlogg
//   g  GitHub-portal     l  LinkedIn-portal
//   S  skjelett          T  fakkel
//   x  sprukket vegg
export const KART = [
  '###########P###########',
  '#T...................T#',
  '#....S...........S....#',
  '#.....................#',
  'O.......S.....S.......E',
  '#.....................#',
  'x.....S....@Q...S.....#',
  '#T.....g.......l.....T#',
  '###########K###########',
];

// Hver rute er 16 × 16 spillpiksler, samme størrelse som rutene i
// pikselgrafikken vi legger på i steg 6
export const RUTE = 16;

export const KOLONNER = KART[0].length;
export const RADER = KART.length;

// Spillets oppløsning regnes ut fra kartet: 23 × 16 = 368 og 9 × 16 = 144
export const BREDDE = KOLONNER * RUTE;
export const HOYDE = RADER * RUTE;

// Midlertidige farger per tegn, til vi har pikselgrafikk i steg 6
const FARGER: Record<string, string> = {
  '#': '#3b3f4a', // vegg
  x: '#4d4f58', // sprukket vegg, litt lysere enn vanlig vegg
  '.': '#1f2128', // gulv
  '@': '#1f2128', // start er bare gulv
  P: '#8a5a36', // dører
  O: '#8a5a36',
  E: '#8a5a36',
  K: '#8a5a36',
  Q: '#c9a227', // questlogg
  g: '#5b7cfa', // portaler
  l: '#5b7cfa',
  S: '#d8d4cc', // skjeletter
  T: '#e0662f', // fakler
};

// Brukes hvis kartet har et tegn som mangler i FARGER. Knallrosa er en gammel
// spilltradisjon for «her mangler noe», fordi feilen da er umulig å overse.
const MANGLER_FARGE = '#ff00ff';

// Tegner hele kartet, rute for rute. Kartet dekker hele flaten, så dette visker
// samtidig ut forrige bilde.
export function tegnKart(ctx: CanvasRenderingContext2D): void {
  // Ytre løkke: én runde per rad, ovenfra og ned
  for (let rad = 0; rad < RADER; rad++) {
    // Indre løkke: én runde per rute i raden, fra venstre mot høyre
    for (let kol = 0; kol < KOLONNER; kol++) {
      const tegn = KART[rad][kol];
      const farge = FARGER[tegn] ?? MANGLER_FARGE;

      ctx.fillStyle = farge;
      // Rutens øverste venstre hjørne: kolonnen styrer x, raden styrer y
      ctx.fillRect(kol * RUTE, rad * RUTE, RUTE, RUTE);
    }
  }
}

// Finner første rute med et gitt tegn, f.eks. '@' for startposisjonen.
// Gir undefined hvis tegnet ikke finnes i kartet.
export function finnRute(tegn: string): { kol: number; rad: number } | undefined {
  for (let rad = 0; rad < RADER; rad++) {
    // indexOf gir plassen til tegnet i raden, eller -1 hvis det ikke er der
    const kol = KART[rad].indexOf(tegn);
    if (kol !== -1) {
      return { kol, rad };
    }
  }
  return undefined;
}

// Sjekk under utvikling: si fra i Console hvis en rad har feil lengde.
// (Dette er også et eksempel på en for-løkke.)
for (let rad = 0; rad < RADER; rad++) {
  if (KART[rad].length !== KOLONNER) {
    console.warn(`Kartet: rad ${rad} har ${KART[rad].length} tegn, forventet ${KOLONNER}`);
  }
}
