// Spilleren: hvor den er, hvordan den beveger seg og hvordan den tegnes.
import { hentRetning } from './input';
import { finnRute, RUTE } from './kart';

// Litt mindre enn en rute, så spilleren lett passer gjennom åpninger på én rute
const STORRELSE = 12;
const FART = 70; // spillpiksler per sekund

// Spilleren starter midt i ruten merket '@' i kartet. Mangler '@', starter
// den øverst til venstre inne i rommet i stedet for å krasje.
const start = finnRute('@') ?? { kol: 1, rad: 1 };
const MARG = (RUTE - STORRELSE) / 2; // luft mellom spilleren og rutens kant: 2 piksler

export const spiller = {
  x: start.kol * RUTE + MARG,
  y: start.rad * RUTE + MARG,
  storrelse: STORRELSE,
};

export function oppdaterSpiller(dt: number): void {
  const retning = hentRetning();

  // Lengden av retningen, regnet ut med Pythagoras: √(x² + y²).
  // Rett fram er lengden 1. Skrått (x = 1, y = 1) er den √2 ≈ 1,41.
  const lengde = Math.hypot(retning.x, retning.y);

  // Lengde 0 betyr at ingen piltast holdes, og da står spilleren stille
  if (lengde > 0) {
    // Ved å dele på lengden blir retningen alltid 1 lang, så spilleren ikke
    // går 41 % fortere skrått. Så bruker vi strekning = fart × tid, som i steg 1.
    spiller.x += (retning.x / lengde) * FART * dt;
    spiller.y += (retning.y / lengde) * FART * dt;
  }
}

export function tegnSpiller(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#f0a04b';
  // Math.round: tegn på hele spillpiksler, så spilleren ikke blir uskarp i kantene
  ctx.fillRect(Math.round(spiller.x), Math.round(spiller.y), spiller.storrelse, spiller.storrelse);
}
