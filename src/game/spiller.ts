// Spilleren: hvor den er, hvordan den beveger seg og hvordan den tegnes.
import { hentRetning } from './input';
import { finnRute, kolliderer, LITT, RUTE } from './kart';
import { animasjonsbilde, SPRITES, tegnSprite } from './sprites';

// Størrelsen på treffboksen, altså den delen av spilleren som kan kollidere.
// Litt mindre enn en rute, så spilleren lett passer gjennom åpninger på én rute.
// Ridderen som tegnes er større (16 × 28), se tegnSpiller.
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
  gaar: false, // går spilleren akkurat nå? Styrer hvilken animasjon som vises.
  serVenstre: false, // ridderen ser mot høyre i grafikken, så venstre = speilvendt
};

export function oppdaterSpiller(dt: number): void {
  const retning = hentRetning();

  // Lengden av retningen, regnet ut med Pythagoras: √(x² + y²).
  // Rett fram er lengden 1. Skrått (x = 1, y = 1) er den √2 ≈ 1,41.
  const lengde = Math.hypot(retning.x, retning.y);

  spiller.gaar = lengde > 0;
  // Snu ridderen bare når den går til siden. Går den rett opp eller ned,
  // beholder den retningen den hadde.
  if (retning.x < 0) spiller.serVenstre = true;
  if (retning.x > 0) spiller.serVenstre = false;

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

// Tegner ridderen. tid (sekunder siden start) bestemmer hvilket bilde i
// animasjonen som vises.
export function tegnSpiller(ctx: CanvasRenderingContext2D, tid: number): void {
  // Løpeanimasjonen går raskere enn stå-animasjonen
  const bilde = spiller.gaar
    ? animasjonsbilde(SPRITES.ridderLoper, tid, 10)
    : animasjonsbilde(SPRITES.ridderStaar, tid, 5);

  // Ridderen (16 × 28) er større enn treffboksen (12 × 12). Vi midtstiller den
  // over boksen og lar føttene stå på bunnen av boksen. Da kan hodet stikke
  // opp foran veggen bak, slik det skal i dette perspektivet.
  const x = spiller.x + STORRELSE / 2 - bilde.b / 2;
  const y = spiller.y + STORRELSE - bilde.h;

  tegnSprite(ctx, bilde, x, y, { speilX: spiller.serVenstre });
}
