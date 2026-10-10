// Tingene man kan samhandle med: dørene, questloggen, portalene og gummianda.
// Her finner vi dem i kartet, sjekker hva spilleren står nær, og bestemmer
// hva som skjer når man trykker E.
import { DORER, PAASKEEGG, PORTALER } from '../data/dungeon';
import { overlapper, type Figur } from './figur';
import { bleTrykket } from './input';
import { KART, KOLONNER, RADER, RUTE, settRute } from './kart';
import { naermesteSkjelett } from './skjeletter';
import { spiller } from './spiller';
import { aapneLenke, gaaTilSeksjon, visHint, visMelding, visQuestlogg } from './ui';

export interface Objekt {
  hint: string; // teksten etter «E», f.eks. «Gå til Prosjekter»
  x: number; // punktet spilleren må stå nær, i spillpiksler
  y: number;
  hintY: number; // hvor hintet vises (det legges rett over dette punktet)
  type: 'dor' | 'questlogg' | 'lenke' | 'and';
  maal: string; // dører: seksjonens id. Lenker: nettadressen. Ellers tom.
  navn: string; // kort navn, brukes på skiltene over dørene
  skjult?: boolean; // ? betyr valgfritt felt. Skjulte objekter kan ikke brukes ennå.
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

      // Gummianda sitter bak den sprukne veggen. Den finnes fra start, men er
      // skjult til veggen er knust.
      if (tegn === 'x') {
        liste.push({
          hint: 'Snakk med gummianda',
          navn: 'Gummiand',
          x: midtX,
          y: midtY,
          hintY: rad * RUTE,
          type: 'and',
          maal: '',
          skjult: true,
        });
      }
    }
  }
  return liste;
}

// Kalles hvert bilde. Viser ett hint, i denne rekkefølgen:
//   1. et objekt man kan bruke med E (og bruker det hvis E ble trykket)
//   2. den sprukne veggen, hvis man står inntil den
//   3. et skjelett i nærheten
export function oppdaterSamhandling(): void {
  const objekt = finnNaermeste((o) => !o.skjult);
  if (objekt) {
    visHint({ tast: 'E', tekst: objekt.hint, x: objekt.x, y: objekt.hintY });
    if (bleTrykket('KeyE')) {
      samhandle(objekt);
    }
    return;
  }

  // En skjult and betyr at veggen foran den fortsatt står
  const sprekk = finnNaermeste((o) => o.skjult === true);
  if (sprekk) {
    visHint({ tast: 'Mellomrom', tekst: 'Slå den sprukne veggen', x: sprekk.x, y: sprekk.hintY });
    return;
  }

  const midtX = spiller.x + spiller.storrelse / 2;
  const midtY = spiller.y + spiller.storrelse / 2;
  const skjelett = naermesteSkjelett(midtX, midtY, REKKEVIDDE);
  if (skjelett) {
    // Hintet følger skjelettet: midt over det, rett over hodet (grafikken er
    // 6 piksler høyere enn treffboksen)
    visHint({
      tast: 'Mellomrom',
      tekst: `Slå ${skjelett.navn}`,
      x: skjelett.x + skjelett.storrelse / 2,
      y: skjelett.y - 7,
    });
    return;
  }

  visHint(undefined);
}

// Finner objektet nærmest spilleren, men bare hvis det er innenfor rekkevidde
// og godkjent av «aktuell». aktuell er en funksjon som svarer true/false for
// hvert objekt, slik at samme søk kan brukes til ulike formål.
function finnNaermeste(aktuell: (objekt: Objekt) => boolean): Objekt | undefined {
  const spillerX = spiller.x + spiller.storrelse / 2;
  const spillerY = spiller.y + spiller.storrelse / 2;

  let naermeste: Objekt | undefined = undefined;
  let kortesteAvstand = REKKEVIDDE;

  for (const objekt of OBJEKTER) {
    if (!aktuell(objekt)) continue;

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
    case 'and':
      snakkMedAnda();
      break;
  }
}

// Kalles fra kamp.ts ved hvert slag. Treffer slaget den sprukne veggen,
// raser den sammen, og gummianda kommer til syne.
export function slaaPaaVegg(treffomrade: Figur): void {
  for (const objekt of OBJEKTER) {
    if (!objekt.skjult) continue;

    // Ruten objektet står i, som en figur, så vi kan bruke overlapper()
    const rute: Figur = { x: objekt.x - RUTE / 2, y: objekt.y - RUTE / 2, storrelse: RUTE };
    if (!overlapper(treffomrade, rute)) continue;

    objekt.skjult = false;
    settRute(Math.floor(objekt.x / RUTE), Math.floor(objekt.y / RUTE), 'u');
    visMelding(PAASKEEGG.nisje);
  }
}

// Gummianda sier to ting, med en liten pause imellom. Mens den snakker,
// starter ikke et nytt E-trykk samtalen på nytt.
let andaSnakker = false;

function snakkMedAnda(): void {
  if (andaSnakker) return;
  andaSnakker = true;

  const [forst, sa] = PAASKEEGG.and; // henter de to replikkene ut av listen
  visMelding(forst, 3500);
  window.setTimeout(() => {
    visMelding(sa, 4000);
    andaSnakker = false;
  }, 3500);
}
