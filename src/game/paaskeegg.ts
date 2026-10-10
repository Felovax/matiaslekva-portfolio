// Påskeegg som handler om hva spilleren gjør (eller ikke gjør):
// å gå inn i veggen gang på gang, og å stå stille lenge.
// (Den sprukne veggen og gummianda ligger i objekter.ts, og prestasjonen i kamp.ts.)
import { PAASKEEGG } from '../data/dungeon';
import { erAktiv, harInput } from './input';
import { visMelding } from './ui';

const DUNK_ANTALL = 4; // så mange dunk …
const DUNK_VINDU = 3; // … innenfor så mange sekunder
const AFK_ETTER = 30; // sekunder uten en eneste tast

let klokke = 0; // sekunder spillet har kjørt (står stille når dungeonen er ute av bildet)
let dunkTider: number[] = []; // når de siste dunkene skjedde, målt med klokke
let stilleTid = 0; // sekunder siden forrige tastetrykk
let afkVist = false; // så meldingen bare vises én gang per stille periode

// dunket: traff spilleren noe akkurat i dette bildet?
export function oppdaterPaaskeegg(dt: number, dunket: boolean): void {
  klokke += dt;

  if (dunket) {
    dunkTider.push(klokke);
    // Glem dunkene som er eldre enn vinduet. filter beholder bare de som er nye nok.
    dunkTider = dunkTider.filter((tid) => klokke - tid <= DUNK_VINDU);

    if (dunkTider.length >= DUNK_ANTALL) {
      visMelding(PAASKEEGG.dunk);
      dunkTider = []; // start tellingen på nytt
    }
  }

  // Mens spillet er på pause (f.eks. questloggen er åpen), teller vi ikke AFK
  if (!erAktiv()) return;

  if (harInput()) {
    stilleTid = 0;
    afkVist = false;
    return;
  }

  stilleTid += dt;
  if (stilleTid >= AFK_ETTER && !afkVist) {
    visMelding(PAASKEEGG.afk, 4000);
    afkVist = true;
  }
}
