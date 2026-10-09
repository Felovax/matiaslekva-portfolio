// Skjelettene: hvor de starter, hvordan de vandrer rundt og hvordan de tegnes.
// De er der for stemningens skyld og kan ikke skade spilleren.
import { SKJELETTER } from '../data/dungeon';
import { flytt, type Figur } from './figur';
import { KART, KOLONNER, RADER, RUTE } from './kart';
import { animasjonsbilde, SPRITES, tegnSprite } from './sprites';

// Et skjelett er en Figur (har x, y og storrelse) med noe ekstra.
// «extends» betyr: alt fra Figur, pluss feltene under.
export interface Skjelett extends Figur {
  navn: string;
  melding: string; // vises når skjelettet er beseiret (steg 4.2)
  retning: { x: number; y: number }; // hvor det går. (0, 0) = står stille
  nesteValg: number; // sekunder til det bestemmer seg for noe nytt
  serVenstre: boolean;
  takt: number; // så skjelettene ikke animeres helt likt
}

// Treffboksen er mindre enn grafikken (16 × 16), omtrent som kroppen
const STORRELSE = 10;
const FART = 18; // spillpiksler per sekund, mye saktere enn spilleren (70)

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
      });
    }
  }
  return liste;
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
  // Alle figurene et skjelett kan støte i: spilleren og de andre skjelettene.
  // ...skjeletter «pakker ut» listen, så alle havner i den nye listen.
  const alleFigurer: Figur[] = [spiller, ...skjeletter];

  for (const skjelett of skjeletter) {
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

export function tegnSkjelett(ctx: CanvasRenderingContext2D, skjelett: Skjelett, tid: number): void {
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
