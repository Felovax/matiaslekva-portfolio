// Spilleren: hvor den er, hvordan den beveger seg og hvordan den tegnes.
import { hentRetning } from './input';
import { finnRute, kolliderer, LITT, RUTE } from './kart';

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

  // Lengde 0 betyr at ingen tast holdes. Da står spilleren stille, og vi
  // avslutter med en gang (og unngår å dele på 0).
  if (lengde === 0) return;

  // Ved å dele på lengden blir retningen alltid 1 lang, så spilleren ikke går
  // 41 % fortere skrått. Så bruker vi strekning = fart × tid, som i steg 1.
  const dx = (retning.x / lengde) * FART * dt;
  const dy = (retning.y / lengde) * FART * dt;

  // Én akse om gangen: først bortover, så opp/ned. Da kan spilleren gli langs
  // en vegg når den går skrått mot den, i stedet for å bli stående fast.
  flyttBortover(dx);
  flyttOppNed(dy);
}

// Prøver å flytte spilleren dx piksler bortover (negativ dx = mot venstre)
function flyttBortover(dx: number): void {
  if (dx === 0) return;

  const nyX = spiller.x + dx;
  if (!kolliderer(nyX, spiller.y, STORRELSE, STORRELSE)) {
    spiller.x = nyX; // veien er fri
    return;
  }

  // Veien er stengt. I stedet for å stoppe et lite stykke unna legger vi
  // spilleren helt inntil ruten den traff. Det er ruten spillerens fremste
  // kant havnet i. (Det stemmer fordi spilleren aldri flytter seg mer enn
  // én rute per bilde, og det sørger MAKS_DT i main.ts for.)
  if (dx > 0) {
    const kol = Math.floor((nyX + STORRELSE - LITT) / RUTE);
    spiller.x = kol * RUTE - STORRELSE; // høyre kant inntil rutens venstre side
  } else {
    const kol = Math.floor(nyX / RUTE);
    spiller.x = (kol + 1) * RUTE; // venstre kant inntil rutens høyre side
  }
}

// Samme som flyttBortover, bare for y (negativ dy = oppover)
function flyttOppNed(dy: number): void {
  if (dy === 0) return;

  const nyY = spiller.y + dy;
  if (!kolliderer(spiller.x, nyY, STORRELSE, STORRELSE)) {
    spiller.y = nyY;
    return;
  }

  if (dy > 0) {
    const rad = Math.floor((nyY + STORRELSE - LITT) / RUTE);
    spiller.y = rad * RUTE - STORRELSE; // bunnen inntil rutens overside
  } else {
    const rad = Math.floor(nyY / RUTE);
    spiller.y = (rad + 1) * RUTE; // toppen inntil rutens underside
  }
}

export function tegnSpiller(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#f0a04b';
  // Math.round: tegn på hele spillpiksler, så spilleren ikke blir uskarp i kantene
  ctx.fillRect(Math.round(spiller.x), Math.round(spiller.y), spiller.storrelse, spiller.storrelse);
}
