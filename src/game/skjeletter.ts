// Skjelettene: hvor de starter, hvordan de vandrer rundt, hva som skjer når
// de blir truffet, og hvordan de tegnes. De er der for stemningens skyld og
// kan ikke skade spilleren.
import { SKJELETTER } from '../data/dungeon';
import { flytt, type Figur } from './figur';
import { KART, KOLONNER, RADER, RUTE } from './kart';
import { animasjonsbilde, SPRITES, tegnSprite } from './sprites';

// Et skjelett er en Figur (har x, y og storrelse) med noe ekstra.
// «extends» betyr: alt fra Figur, pluss feltene under.
export interface Skjelett extends Figur {
  navn: string;
  melding: string; // vises når skjelettet er beseiret
  retning: { x: number; y: number }; // hvor det går. (0, 0) = står stille
  nesteValg: number; // sekunder til det bestemmer seg for noe nytt
  serVenstre: boolean;
  takt: number; // så skjelettene ikke animeres helt likt
  liv: number; // treff som skal til før det faller
  blinkTid: number; // sekunder igjen av blinkingen etter et treff
  dytt: { x: number; y: number }; // fart bakover etter et treff, i spillpiksler per sekund
  dyttTid: number; // sekunder igjen av dyttet
  beseiret: boolean;
}

// Treffboksen er mindre enn grafikken (16 × 16), omtrent som kroppen
const STORRELSE = 10;
const FART = 18; // spillpiksler per sekund, mye saktere enn spilleren (70)
const LIV = 2; // to slag
const BLINK_VARER = 0.3; // sekunder
const DYTT_FART = 90; // spillpiksler per sekund
const DYTT_VARER = 0.12; // sekunder, altså rundt 11 piksler bakover
const FORVIRRET = 0.6; // sekunder det står stille etter et treff

// Alle skjelettene, laget én gang ved oppstart fra S-ene i kartet
export const skjeletter: Skjelett[] = lagSkjeletter();

function lagSkjeletter(): Skjelett[] {
  const liste: Skjelett[] = [];

  for (let rad = 0; rad < RADER; rad++) {
    for (let kol = 0; kol < KOLONNER; kol++) {
      if (KART[rad][kol] !== 'S') continue; // continue: hopp videre til neste rute

      // Navn i den rekkefølgen skjelettene finnes. % gjør at listen starter
      // forfra hvis kartet en gang får flere skjeletter enn navn.
      const data = SKJELETTER[liste.length % SKJELETTER.length];

      liste.push({
        navn: data.navn,
        melding: data.melding,
        // Midt i ruten bortover, med føttene på bunnen av ruten
        x: kol * RUTE + (RUTE - STORRELSE) / 2,
        y: rad * RUTE + RUTE - STORRELSE,
        storrelse: STORRELSE,
        retning: { x: 0, y: 0 },
        nesteValg: Math.random() * 2, // ikke alle bestemmer seg samtidig
        serVenstre: Math.random() < 0.5,
        takt: kol,
        liv: LIV,
        blinkTid: 0,
        dytt: { x: 0, y: 0 },
        dyttTid: 0,
        beseiret: false,
      });
    }
  }
  return liste;
}

// Skjelettene som fortsatt står. filter lager en ny liste med bare de som
// oppfyller betingelsen.
export function levendeSkjeletter(): Skjelett[] {
  return skjeletter.filter((skjelett) => !skjelett.beseiret);
}

// Lar skjelettet bestemme seg for noe nytt: stå stille, eller gå i en
// tilfeldig retning
function velgNyRetning(skjelett: Skjelett): void {
  if (Math.random() < 0.4) {
    // 40 % av gangene: stå stille en stund
    skjelett.retning = { x: 0, y: 0 };
  } else {
    // En tilfeldig vinkel rundt hele sirkelen (2π radianer = 360 grader).
    // cos og sin gjør vinkelen om til en retning som alltid er 1 lang,
    // samme egenskap som vi fikk ved å dele på lengden i steg 4.
    const vinkel = Math.random() * Math.PI * 2;
    skjelett.retning = { x: Math.cos(vinkel), y: Math.sin(vinkel) };
  }
  // Neste gang det bestemmer seg: om 1 til 3 sekunder
  skjelett.nesteValg = 1 + Math.random() * 2;
}

// Flytter alle skjelettene. spiller sendes inn, så skjelettene ikke går gjennom den.
export function oppdaterSkjeletter(dt: number, spiller: Figur): void {
  const levende = levendeSkjeletter();
  // Alle figurene et skjelett kan støte i: spilleren og de andre levende
  // skjelettene. ...levende «pakker ut» listen, så alle havner i den nye listen.
  const alleFigurer: Figur[] = [spiller, ...levende];

  for (const skjelett of levende) {
    skjelett.blinkTid = Math.max(0, skjelett.blinkTid - dt);

    // Nettopp truffet: dyttes bakover en liten stund, og går ikke selv imens
    if (skjelett.dyttTid > 0) {
      skjelett.dyttTid -= dt;
      flytt(skjelett, skjelett.dytt.x * dt, skjelett.dytt.y * dt, alleFigurer);
      continue;
    }

    skjelett.nesteValg -= dt;
    if (skjelett.nesteValg <= 0) {
      velgNyRetning(skjelett);
    }

    const { x, y } = skjelett.retning;
    if (x === 0 && y === 0) continue; // står stille

    const { stoppetX, stoppetY } = flytt(skjelett, x * FART * dt, y * FART * dt, alleFigurer);
    // Gikk det i veggen eller i noen? Da finner det på noe annet med en gang.
    if (stoppetX || stoppetY) {
      velgNyRetning(skjelett);
    }

    if (x < 0) skjelett.serVenstre = true;
    if (x > 0) skjelett.serVenstre = false;
  }
}

// Et skjelett blir truffet av et slag fra retningen «fra» (blikkretningen til
// spilleren). Svarer true hvis skjelettet falt.
export function treffSkjelett(skjelett: Skjelett, fra: { x: number; y: number }): boolean {
  skjelett.liv -= 1;

  if (skjelett.liv <= 0) {
    skjelett.beseiret = true;
    return true;
  }

  // Overlevde: blink, dytt bakover i slagets retning, og stå forvirret litt
  skjelett.blinkTid = BLINK_VARER;
  skjelett.dytt = { x: fra.x * DYTT_FART, y: fra.y * DYTT_FART };
  skjelett.dyttTid = DYTT_VARER;
  skjelett.retning = { x: 0, y: 0 };
  skjelett.nesteValg = FORVIRRET;
  // Snu det mot den som slo (motsatt av slagets retning)
  if (fra.x !== 0) skjelett.serVenstre = fra.x > 0;
  return false;
}

// Finner det nærmeste levende skjelettet innenfor en avstand fra et punkt
export function naermesteSkjelett(x: number, y: number, maksAvstand: number): Skjelett | undefined {
  let naermeste: Skjelett | undefined = undefined;
  let kortest = maksAvstand;

  for (const skjelett of levendeSkjeletter()) {
    const avstand = Math.hypot(
      skjelett.x + skjelett.storrelse / 2 - x,
      skjelett.y + skjelett.storrelse / 2 - y,
    );
    if (avstand <= kortest) {
      naermeste = skjelett;
      kortest = avstand;
    }
  }
  return naermeste;
}

export function tegnSkjelett(ctx: CanvasRenderingContext2D, skjelett: Skjelett, tid: number): void {
  // Blinking: hopp over tegningen annethvert tjuendedels sekund
  if (skjelett.blinkTid > 0 && Math.floor(skjelett.blinkTid * 20) % 2 === 0) {
    return;
  }

  const gaar = skjelett.retning.x !== 0 || skjelett.retning.y !== 0;
  const bilde = gaar
    ? animasjonsbilde(SPRITES.skjelettLoper, tid, 8, skjelett.takt)
    : animasjonsbilde(SPRITES.skjelettStaar, tid, 6, skjelett.takt);

  // Samme prinsipp som ridderen: grafikken midtstilles over treffboksen,
  // med føttene på bunnen av boksen
  const x = skjelett.x + STORRELSE / 2 - bilde.b / 2;
  const y = skjelett.y + STORRELSE - bilde.h;
  tegnSprite(ctx, bilde, x, y, { speilX: skjelett.serVenstre });
}

// Hodeskallene etter beseirede skjeletter. Tegnes på gulvet, før figurene,
// så figurene kan gå over dem.
export function tegnHodeskaller(ctx: CanvasRenderingContext2D): void {
  for (const skjelett of skjeletter) {
    if (!skjelett.beseiret) continue;
    const x = skjelett.x + STORRELSE / 2 - SPRITES.hodeskalle.b / 2;
    const y = skjelett.y + STORRELSE - SPRITES.hodeskalle.h;
    tegnSprite(ctx, SPRITES.hodeskalle, x, y);
  }
}
