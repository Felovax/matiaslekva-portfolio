// Felles for alt som beveger seg: spilleren og skjelettene.
// Koden er den samme som spilleren fikk i steg 5, men tar nå imot HVILKEN
// figur som skal flyttes. Da kan skjelettene bruke den også.
import { kolliderer, LITT, RUTE } from './kart';

// Det en figur må ha for å kunne flyttes og kollidere: en kvadratisk
// treffboks. Spilleren og skjelettene har flere egenskaper, men alle har disse.
export interface Figur {
  x: number; // treffboksens øverste venstre hjørne, i spillpiksler
  y: number;
  storrelse: number;
}

// Ville figuren overlappet en annen figur hvis den sto på (x, y)?
// To rektangler overlapper hvis de overlapper både bortover og nedover.
function treffer(figur: Figur, x: number, y: number, annen: Figur): boolean {
  return (
    x < annen.x + annen.storrelse &&
    x + figur.storrelse > annen.x &&
    y < annen.y + annen.storrelse &&
    y + figur.storrelse > annen.y
  );
}

// Ville figuren truffet noen av de andre figurene på (x, y)?
function trefferNoen(figur: Figur, x: number, y: number, andre: Figur[]): boolean {
  for (const annen of andre) {
    // En figur kan ikke kollidere med seg selv
    if (annen !== figur && treffer(figur, x, y, annen)) {
      return true;
    }
  }
  return false;
}

// Flytter en figur dx bortover og dy nedover, én akse om gangen, så den kan
// gli langs vegger. andre er figurene den ikke kan gå gjennom.
// Svarer med om figuren ble stoppet, slik at f.eks. et skjelett kan snu.
export function flytt(
  figur: Figur,
  dx: number,
  dy: number,
  andre: Figur[],
): { stoppetX: boolean; stoppetY: boolean } {
  return {
    stoppetX: !flyttBortover(figur, dx, andre),
    stoppetY: !flyttOppNed(figur, dy, andre),
  };
}

// Prøver å flytte figuren dx piksler bortover. Svarer true hvis det gikk.
function flyttBortover(figur: Figur, dx: number, andre: Figur[]): boolean {
  if (dx === 0) return true;

  const nyX = figur.x + dx;

  // Vegg i veien: legg figuren helt inntil ruten den traff (som i steg 5)
  if (kolliderer(nyX, figur.y, figur.storrelse, figur.storrelse)) {
    if (dx > 0) {
      const kol = Math.floor((nyX + figur.storrelse - LITT) / RUTE);
      figur.x = kol * RUTE - figur.storrelse;
    } else {
      const kol = Math.floor(nyX / RUTE);
      figur.x = (kol + 1) * RUTE;
    }
    return false;
  }

  // En annen figur i veien: bare bli stående. Vi legger den ikke helt inntil,
  // for figurer flytter seg uansett, og avstanden blir under én piksel.
  if (trefferNoen(figur, nyX, figur.y, andre)) {
    return false;
  }

  figur.x = nyX;
  return true;
}

// Samme som flyttBortover, bare for y
function flyttOppNed(figur: Figur, dy: number, andre: Figur[]): boolean {
  if (dy === 0) return true;

  const nyY = figur.y + dy;

  if (kolliderer(figur.x, nyY, figur.storrelse, figur.storrelse)) {
    if (dy > 0) {
      const rad = Math.floor((nyY + figur.storrelse - LITT) / RUTE);
      figur.y = rad * RUTE - figur.storrelse;
    } else {
      const rad = Math.floor(nyY / RUTE);
      figur.y = (rad + 1) * RUTE;
    }
    return false;
  }

  if (trefferNoen(figur, figur.x, nyY, andre)) {
    return false;
  }

  figur.y = nyY;
  return true;
}
