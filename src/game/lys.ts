// Lys og mørke: rommet gjøres litt mørkere, og faklene, ridderen og portalene
// lyser opp rundt seg.
//
// Teknikken er et eget, usynlig canvas, et «lyskart»:
//   1. Fyll lyskartet med halvgjennomsiktig mørke.
//   2. «Visk ut» myke sirkler der det er lys.
//   3. Legg lyskartet over spillet: mørket dekker alt, unntatt der det er lys.
//   4. Legg en svak, varm glød rundt faklene, så lyset blir oransje.
import { BREDDE, HOYDE, KART, KOLONNER, RADER, RUTE } from './kart';
import { onskerMindreBevegelse } from './mindreBevegelse';

// Hvor mørkt rommet er utenfor lyset: 0 = ikke mørkt, 1 = helt svart.
// Moderat, så alt fortsatt kan sees. Porteføljen kommer først.
const MORKE = 0.45;

const FAKKEL_RADIUS = 58; // i spillpiksler
const SPILLER_RADIUS = 38;
const PORTAL_RADIUS = 22;

// Lyskartet: samme størrelse som spillet, men aldri vist direkte
const lyskart = document.createElement('canvas');
lyskart.width = BREDDE;
lyskart.height = HOYDE;
const lys = lyskart.getContext('2d');

interface Lyspunkt {
  x: number;
  y: number;
  takt: number; // så faklene ikke flimrer i takt
}

// Faklene finnes i kartet én gang. Flammen sitter øverst i ruten.
const FAKLER: Lyspunkt[] = [];
// Portalene: farge for gløden, hentet fra samme farger som i kart.ts
const PORTALER: { x: number; y: number; farge: string }[] = [];

for (let rad = 0; rad < RADER; rad++) {
  for (let kol = 0; kol < KOLONNER; kol++) {
    const tegn = KART[rad][kol];
    const midtX = kol * RUTE + RUTE / 2;
    if (tegn === 'T') {
      FAKLER.push({ x: midtX, y: rad * RUTE + 5, takt: kol });
    }
    if (tegn === 'g') {
      PORTALER.push({ x: midtX, y: rad * RUTE + RUTE / 2, farge: '230, 237, 243' });
    }
    if (tegn === 'l') {
      PORTALER.push({ x: midtX, y: rad * RUTE + RUTE / 2, farge: '10, 102, 194' });
    }
  }
}

// Hvor mye en fakkel flimrer akkurat nå: noen få piksler opp eller ned.
// To sinusbølger med ulik fart gir et mer naturlig, ujevnt flimmer enn én.
function flimmer(tid: number, takt: number): number {
  if (onskerMindreBevegelse()) return 0;
  return Math.sin(tid * 7 + takt) * 2 + Math.sin(tid * 13 + takt * 2) * 1.5;
}

// Visker ut en myk sirkel av mørket. Sterkest i midten, ingenting ytterst.
function lysHull(x: number, y: number, radius: number, styrke: number): void {
  if (!lys) return;
  const gradient = lys.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${styrke})`);
  gradient.addColorStop(0.5, `rgba(0, 0, 0, ${styrke * 0.6})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  lys.fillStyle = gradient;
  lys.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

// En farget glød som legges oppå spillet. farge er «r, g, b».
function glod(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  farge: string,
  styrke: number,
): void {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${farge}, ${styrke})`);
  gradient.addColorStop(1, `rgba(${farge}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

// Tegner lyset over alt annet. spillerX og spillerY er midten av ridderen.
export function tegnLys(ctx: CanvasRenderingContext2D, tid: number, spillerX: number, spillerY: number): void {
  if (!lys) return; // nettleseren kunne ikke lage lyskartet: dropp lyset, spillet virker likevel

  // 1. Mørket. source-over er vanlig tegning, som legger nytt oppå gammelt.
  lys.globalCompositeOperation = 'source-over';
  lys.clearRect(0, 0, BREDDE, HOYDE);
  lys.fillStyle = `rgba(5, 4, 10, ${MORKE})`;
  lys.fillRect(0, 0, BREDDE, HOYDE);

  // 2. Lyset. destination-out betyr: det vi tegner nå, visker ut det som er der.
  lys.globalCompositeOperation = 'destination-out';
  for (const fakkel of FAKLER) {
    lysHull(fakkel.x, fakkel.y, FAKKEL_RADIUS + flimmer(tid, fakkel.takt), 1);
  }
  lysHull(spillerX, spillerY, SPILLER_RADIUS, 0.8);
  for (const portal of PORTALER) {
    lysHull(portal.x, portal.y, PORTAL_RADIUS, 0.7);
  }

  // 3. Legg mørket over spillet
  ctx.drawImage(lyskart, 0, 0);

  // 4. Farget glød. lighter betyr: legg fargene sammen, så det blir lysere og
  // varmere, i stedet for å male over.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const fakkel of FAKLER) {
    glod(ctx, fakkel.x, fakkel.y, 30 + flimmer(tid, fakkel.takt), '255, 140, 50', 0.16);
  }
  for (const portal of PORTALER) {
    glod(ctx, portal.x, portal.y, PORTAL_RADIUS, portal.farge, 0.12);
  }
  ctx.restore(); // tilbake til vanlig tegning
}
