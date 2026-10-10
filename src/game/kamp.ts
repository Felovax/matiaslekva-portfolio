// Kamp: mellomrom stikker med sverdet i retningen ridderen ser.
// Treffer sverdet et skjelett, mister skjelettet ett liv. Etter to treff
// faller det, og spilleren får XP.
import { PAASKEEGG } from '../data/dungeon';
import { overlapper, type Figur } from './figur';
import { bleTrykket } from './input';
import { slaaPaaVegg } from './objekter';
import { levendeSkjeletter, skjeletter, treffSkjelett } from './skjeletter';
import { spiller } from './spiller';
import { SPRITES, tegnSpriteRotert } from './sprites';
import { oppdaterStatus, visMelding } from './ui';

const NEDKJOLING = 0.35; // sekunder før man kan slå igjen
const SLAG_VARER = 0.15; // sekunder sverdet vises
const TREFFOMRADE = 14; // størrelsen på det usynlige treffområdet foran ridderen
const XP_PER_SKJELETT = 10;

let nedkjoling = 0; // sekunder igjen til neste slag er lov
let slagTid = 0; // sekunder igjen av slaget som vises nå
let xp = 0;

export function oppdaterKamp(dt: number): void {
  // Tell ned, men aldri under 0
  nedkjoling = Math.max(0, nedkjoling - dt);
  slagTid = Math.max(0, slagTid - dt);

  if (bleTrykket('Space') && nedkjoling === 0) {
    slaa();
  }
}

function slaa(): void {
  nedkjoling = NEDKJOLING;
  slagTid = SLAG_VARER;

  const omrade = treffomrade();
  for (const skjelett of levendeSkjeletter()) {
    if (!overlapper(omrade, skjelett)) continue;

    const falt = treffSkjelett(skjelett, spiller.blikk);
    if (falt) {
      xp += XP_PER_SKJELETT;
      visMelding(`${skjelett.melding} +${XP_PER_SKJELETT} XP`);
      oppdaterStatus(xp, skjeletter.length - levendeSkjeletter().length, skjeletter.length);

      if (levendeSkjeletter().length === 0) {
        // Alle er beseiret. Vis prestasjonen når meldingen om det siste
        // skjelettet har fått stå en stund (2,5 sekunder).
        window.setTimeout(() => visMelding(PAASKEEGG.prestasjon, 6000, true), 2600);
      }
    }
  }

  // Slaget kan også treffe den sprukne veggen
  slaaPaaVegg(omrade);
}

// Et usynlig kvadrat rett foran ridderen, i blikkretningen. Det er dette som
// sjekkes mot skjelettene, ikke selve sverd-grafikken.
function treffomrade(): Figur {
  // Midten av spilleren
  const midtX = spiller.x + spiller.storrelse / 2;
  const midtY = spiller.y + spiller.storrelse / 2;
  // Hvor langt foran midten treffområdet ligger: halve spilleren pluss halve
  // området, minus litt så det overlapper spilleren og ikke etterlater en glipe
  const avstand = spiller.storrelse / 2 + TREFFOMRADE / 2 - 2;

  const omradeX = midtX + spiller.blikk.x * avstand;
  const omradeY = midtY + spiller.blikk.y * avstand;
  return {
    x: omradeX - TREFFOMRADE / 2,
    y: omradeY - TREFFOMRADE / 2,
    storrelse: TREFFOMRADE,
  };
}

// Vinkelen sverdet skal dreies, ut fra blikkretningen. Sverdet peker opp i
// grafikken, så opp er 0, og hver kvart runde med klokka er π/2.
function sverdvinkel(): number {
  if (spiller.blikk.x > 0) return Math.PI / 2; // høyre
  if (spiller.blikk.x < 0) return -Math.PI / 2; // venstre
  if (spiller.blikk.y > 0) return Math.PI; // ned
  return 0; // opp
}

// Tegner sverdet mens slaget varer. Kalles to ganger per bilde, før og etter
// ridderen: slår man oppover, er sverdet bak ridderen, ellers foran.
export function tegnSverd(ctx: CanvasRenderingContext2D, lag: 'bak' | 'foran'): void {
  if (slagTid === 0) return;

  const sverdetErBak = spiller.blikk.y < 0;
  if ((lag === 'bak') !== sverdetErBak) return; // feil lag, tegnes i det andre kallet

  // Håndtaket sitter i ridderens hånd: litt over midten av treffboksen,
  // og litt ut i blikkretningen
  const handX = spiller.x + spiller.storrelse / 2 + spiller.blikk.x * 4;
  const handY = spiller.y + spiller.storrelse / 2 - 4 + spiller.blikk.y * 4;
  tegnSpriteRotert(ctx, SPRITES.sverd, handX, handY, sverdvinkel());
}
