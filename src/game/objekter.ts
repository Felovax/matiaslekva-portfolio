// Tingene man kan samhandle med: dørene, questloggen og portalene.
// Her finner vi dem i kartet, sjekker hva spilleren står nær, og bestemmer
// hva som skjer når man trykker E.
import { DORER, PORTALER } from '../data/dungeon';
import { bleTrykket } from './input';
import { KART, KOLONNER, RADER, RUTE } from './kart';
import { spiller } from './spiller';
import { aapneLenke, gaaTilSeksjon, visHint, visQuestlogg } from './ui';

export interface Objekt {
  hint: string; // teksten etter «E», f.eks. «Gå til Prosjekter»
  x: number; // punktet spilleren må stå nær, i spillpiksler
  y: number;
  hintY: number; // hvor hintet vises (det legges rett over dette punktet)
  type: 'dor' | 'questlogg' | 'lenke';
  maal: string; // dører: seksjonens id. Lenker: nettadressen. Questlogg: tom.
  navn: string; // kort navn, brukes på skiltene over dørene
}

// Hvor nær spilleren må stå, målt fra midten av spilleren til objektets punkt
const REKKEVIDDE = 22;

// Lages én gang ved oppstart, ved å lete gjennom kartet etter objekttegn.
// Da er det kartet som bestemmer hvor ting står, og vi slipper å skrive
// koordinater to steder.
export const OBJEKTER: Objekt[] = finnObjekter();

function finnObjekter(): Objekt[] {
  const liste: Objekt[] = [];

  for (let rad = 0; rad < RADER; rad++) {
    for (let kol = 0; kol < KOLONNER; kol++) {
      const tegn = KART[rad][kol];
      // Midten av ruten, i spillpiksler
      const midtX = kol * RUTE + RUTE / 2;
      const midtY = rad * RUTE + RUTE / 2;

      const dor = DORER[tegn];
      // En dør er to tegn brede, så vi registrerer den bare ved det første
      if (dor && KART[rad][kol - 1] !== tegn) {
        liste.push({
          hint: `Gå til ${dor.navn}`,
          navn: dor.navn,
          // Punktet er midt foran døren, der veggen møter gulvet
          x: (kol + 1) * RUTE,
          y: (rad + 1) * RUTE,
          hintY: (rad + 1) * RUTE - 2,
          type: 'dor',
          maal: dor.seksjon,
        });
      }

      if (tegn === 'Q') {
        liste.push({
          hint: 'Les questloggen',
          navn: 'Questlogg',
          x: midtX,
          y: midtY,
          hintY: rad * RUTE,
          type: 'questlogg',
          maal: '',
        });
      }

      const portal = PORTALER[tegn];
      if (portal) {
        liste.push({
          hint: `Åpne ${portal.navn}`,
          navn: portal.navn,
          x: midtX,
          y: midtY,
          hintY: rad * RUTE,
          type: 'lenke',
          maal: portal.url,
        });
      }
    }
  }
  return liste;
}

// Kalles hvert bilde: vis hint for det nærmeste objektet, og utfør det hvis E
// ble trykket
export function oppdaterSamhandling(): void {
  const naermeste = finnNaermeste();
  visHint(naermeste);

  if (naermeste && bleTrykket('KeyE')) {
    samhandle(naermeste);
  }
}

// Finner objektet nærmest spilleren, men bare hvis det er innenfor rekkevidde.
// Gir undefined hvis ingenting er nær nok.
function finnNaermeste(): Objekt | undefined {
  const spillerX = spiller.x + spiller.storrelse / 2;
  const spillerY = spiller.y + spiller.storrelse / 2;

  let naermeste: Objekt | undefined = undefined;
  let kortesteAvstand = REKKEVIDDE;

  for (const objekt of OBJEKTER) {
    // Avstanden mellom to punkter: Pythagoras igjen
    const avstand = Math.hypot(objekt.x - spillerX, objekt.y - spillerY);
    if (avstand <= kortesteAvstand) {
      naermeste = objekt;
      kortesteAvstand = avstand;
    }
  }
  return naermeste;
}

function samhandle(objekt: Objekt): void {
  switch (objekt.type) {
    case 'dor':
      gaaTilSeksjon(objekt.maal);
      break;
    case 'questlogg':
      visQuestlogg();
      break;
    case 'lenke':
      aapneLenke(objekt.maal);
      break;
  }
}
