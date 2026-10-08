// Inngangen til dungeonen. Siden kaller startDungeon(canvas), og herfra styres
// alt som skjer i spillet.
//
// Denne filen er «dirigenten»: den eier spill-løkken og bestemmer rekkefølgen,
// men selve arbeidet gjøres i de andre filene (kart, input, spiller, sprites).
import { BREDDE, HOYDE, tegnKart } from './kart';
import { startInput } from './input';
import { oppdaterSpiller, tegnSpiller } from './spiller';
import { lastInnSprites } from './sprites';

// Lengste tid ett bilde får telle som, i sekunder. Når fanen er skjult, pauser
// nettleseren løkken. Uten denne grensen ville alt hoppet langt i første bilde
// etterpå, og spilleren kunne hoppet rett gjennom en vegg.
const MAKS_DT = 0.1;

// async: funksjonen må vente på at grafikken lastes før spillet kan starte
export async function startDungeon(canvas: HTMLCanvasElement): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // nettleseren støtter ikke canvas

  // Canvaset får nøyaktig kartets størrelse, så det er kartet som bestemmer oppløsningen
  canvas.width = BREDDE;
  canvas.height = HOYDE;
  // Ingen utjevning av piksler. (Må settes etter width/height, som nullstiller den.)
  ctx.imageSmoothingEnabled = false;

  // Dungeonen er valgfri. Hvis grafikken ikke kan lastes, gir vi opp stille,
  // og resten av siden fungerer som før.
  try {
    await lastInnSprites();
  } catch (feil) {
    console.error('Dungeon: klarte ikke å laste grafikken', feil);
    return;
  }

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
      // Animasjonene trenger tiden i sekunder
      tegn(ctx, naa / 1000);
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

// Samme mørke farge som bakgrunnen på nettsiden, så dungeonen glir inn i siden
const BAKGRUNN = '#0d0e12';

// Tegner hele bildet på nytt. Rekkefølgen betyr noe: det som tegnes sist,
// havner øverst, akkurat som når man maler. Derfor kommer kartet først.
function tegn(ctx: CanvasRenderingContext2D, tid: number): void {
  // Visk ut forrige bilde. Deler av veggene er gjennomsiktige, og der ville
  // gamle bilder ellers blitt liggende igjen, f.eks. et spor etter ridderen.
  ctx.fillStyle = BAKGRUNN;
  ctx.fillRect(0, 0, BREDDE, HOYDE);

  tegnKart(ctx, tid);
  tegnSpiller(ctx, tid);
}
