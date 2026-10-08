// Inngangen til dungeonen. Siden kaller startDungeon(canvas), og herfra styres
// alt som skjer i spillet.
import { BREDDE, HOYDE, tegnKart } from './kart';

// En firkant som beveger seg av seg selv. I steg 4 blir den til spilleren.
const boks = {
  x: 20, // posisjon i spillpiksler (øverste venstre hjørne av boksen)
  y: 66,
  storrelse: 12,
  fartX: 80, // spillpiksler per sekund. Negativ fart betyr mot venstre.
};

// Lengste tid ett bilde får telle som, i sekunder. Når fanen er skjult, pauser
// nettleseren løkken. Uten denne grensen ville alt hoppet langt i første bilde
// etterpå, og senere kunne spilleren hoppet rett gjennom en vegg.
const MAKS_DT = 0.1;

export function startDungeon(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // nettleseren støtter ikke canvas

  // Canvaset får nøyaktig kartets størrelse, så det er kartet som bestemmer oppløsningen
  canvas.width = BREDDE;
  canvas.height = HOYDE;

  // Tidspunktet for forrige bilde, i millisekunder
  let forrigeTid = performance.now();

  // Spill-løkken: kjører én gang per bilde, rundt 60 ganger i sekundet
  function loop(naa: number): void {
    // Sekunder siden forrige bilde, men aldri mer enn MAKS_DT
    const dt = Math.min((naa - forrigeTid) / 1000, MAKS_DT);
    forrigeTid = naa;

    oppdater(dt);

    // TypeScript kan ikke vite at ctx fortsatt finnes her inne, så vi sjekker igjen
    if (ctx) {
      tegn(ctx);
    }

    // Be nettleseren kalle loop igjen rett før neste bilde
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// Flytter ting i spillet. dt er sekunder siden forrige bilde.
function oppdater(dt: number): void {
  // strekning = fart × tid
  boks.x += boks.fartX * dt;

  // Traff boksen høyre eller venstre kant? Da snur vi retningen.
  if (boks.x + boks.storrelse > BREDDE || boks.x < 0) {
    boks.fartX = -boks.fartX;
    // Flytt boksen tilbake innenfor kantene, ellers kan den bli stående utenfor
    // og snu seg fram og tilbake i det uendelige
    boks.x = Math.max(0, Math.min(boks.x, BREDDE - boks.storrelse));
  }
}

// Tegner hele bildet på nytt
function tegn(ctx: CanvasRenderingContext2D): void {
  // Kartet dekker hele flaten, så det visker samtidig ut forrige bilde
  tegnKart(ctx);

  // Math.round: tegn på hele spillpiksler, så boksen ikke blir uskarp i kantene
  ctx.fillStyle = '#f0a04b';
  ctx.fillRect(Math.round(boks.x), Math.round(boks.y), boks.storrelse, boks.storrelse);
}
