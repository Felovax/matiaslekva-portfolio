// Inngangen til dungeonen. Siden kaller startDungeon(canvas), og herfra styres
// alt som skjer i spillet.
//
// Denne filen er «dirigenten»: den eier spill-løkken og bestemmer rekkefølgen,
// men selve arbeidet gjøres i de andre filene (kart, input, spiller,
// skjeletter, figur, sprites, objekter og ui).
import { BREDDE, HOYDE, tegnKart } from './kart';
import { nullstillTrykk, settSynlig, startInput } from './input';
import { oppdaterKamp, tegnSverd } from './kamp';
import { OBJEKTER, oppdaterSamhandling } from './objekter';
import {
  levendeSkjeletter,
  oppdaterSkjeletter,
  skjeletter,
  tegnHodeskaller,
  tegnSkjelett,
} from './skjeletter';
import { oppdaterSpiller, spiller, tegnSpiller } from './spiller';
import { lastInnSprites } from './sprites';
import { oppdaterStatus, startUi } from './ui';

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
  startUi(OBJEKTER);
  oppdaterStatus(0, 0, skjeletter.length); // «XP 0 · Skjeletter 0/6»

  // Spillet er bare aktivt når minst halve dungeonen er synlig på skjermen.
  // IntersectionObserver er nettleserens måte å si fra når et element kommer
  // inn i eller går ut av bildet, uten at vi må sjekke det selv hele tiden.
  let synlig = true;
  const observator = new IntersectionObserver(
    (endringer) => {
      synlig = endringer[0].isIntersecting;
      settSynlig(synlig);
    },
    { threshold: 0.5 }, // 0.5 = minst halvparten må være synlig
  );
  observator.observe(canvas);

  // Tidspunktet for forrige bilde, i millisekunder
  let forrigeTid = performance.now();

  // Spill-løkken: kjører én gang per bilde, rundt 60 ganger i sekundet
  function loop(naa: number): void {
    // Sekunder siden forrige bilde, men aldri mer enn MAKS_DT
    const dt = Math.min((naa - forrigeTid) / 1000, MAKS_DT);
    forrigeTid = naa;

    // Er dungeonen rullet ut av bildet, hviler spillet: ingen oppdatering og
    // ingen tegning. Det sparer strøm og prosessor mens man leser siden.
    // TypeScript kan ikke vite at ctx fortsatt finnes her inne, så vi sjekker igjen.
    if (synlig && ctx) {
      oppdater(dt);
      // Animasjonene trenger tiden i sekunder
      tegn(ctx, naa / 1000);
    }

    // Hvert tastetrykk skal bare telle i ett bilde
    nullstillTrykk();

    // Be nettleseren kalle loop igjen rett før neste bilde
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// Flytter alt i spillet. dt er sekunder siden forrige bilde.
function oppdater(dt: number): void {
  // Spilleren kan ikke gå gjennom skjelettene som står, og omvendt
  oppdaterSpiller(dt, levendeSkjeletter());
  oppdaterSkjeletter(dt, spiller);
  oppdaterKamp(dt);
  // Etter at spilleren har flyttet seg: hva står den nær nå?
  oppdaterSamhandling();
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
  // Hodeskallene ligger på gulvet, så de tegnes før figurene
  tegnHodeskaller(ctx);

  // Figurene tegnes sortert etter hvor langt ned føttene står. Den som står
  // lengst ned, er nærmest oss i dette perspektivet og tegnes sist, så den
  // dekker figurene bak seg.
  // Hver figur i listen har «bunn» (hvor føttene står) og «tegn» (en funksjon
  // som tegner den). Slik kan spiller og skjeletter sorteres i samme liste.
  const figurer = [
    {
      bunn: spiller.y + spiller.storrelse,
      // Sverdet tegnes bak ridderen når han slår oppover, ellers foran
      tegn: () => {
        tegnSverd(ctx, 'bak');
        tegnSpiller(ctx, tid);
        tegnSverd(ctx, 'foran');
      },
    },
    ...levendeSkjeletter().map((skjelett) => ({
      bunn: skjelett.y + skjelett.storrelse,
      tegn: () => tegnSkjelett(ctx, skjelett, tid),
    })),
  ];

  // sort sammenligner to og to: et negativt svar betyr at a skal stå før b
  figurer.sort((a, b) => a.bunn - b.bunn);

  for (const figur of figurer) {
    figur.tegn();
  }
}
