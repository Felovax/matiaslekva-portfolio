// Inngangen til dungeonen. Siden kaller startDungeon(canvas), og herfra styres
// alt som skjer i spillet.
//
// Denne filen er «dirigenten»: den eier spill-løkken og bestemmer rekkefølgen,
// men selve arbeidet gjøres i de andre filene (kart, input, spiller).
import { BREDDE, HOYDE, tegnKart } from './kart';
import { startInput } from './input';
import { oppdaterSpiller, tegnSpiller } from './spiller';

// Lengste tid ett bilde får telle som, i sekunder. Når fanen er skjult, pauser
// nettleseren løkken. Uten denne grensen ville alt hoppet langt i første bilde
// etterpå, og spilleren kunne hoppet rett gjennom en vegg.
const MAKS_DT = 0.1;

export function startDungeon(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // nettleseren støtter ikke canvas

  // Canvaset får nøyaktig kartets størrelse, så det er kartet som bestemmer oppløsningen
  canvas.width = BREDDE;
  canvas.height = HOYDE;

  startInput();

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

// Flytter alt i spillet. dt er sekunder siden forrige bilde.
function oppdater(dt: number): void {
  oppdaterSpiller(dt);
}

// Tegner hele bildet på nytt. Rekkefølgen betyr noe: det som tegnes sist,
// havner øverst, akkurat som når man maler. Derfor kommer kartet først.
function tegn(ctx: CanvasRenderingContext2D): void {
  tegnKart(ctx);
  tegnSpiller(ctx);
}
