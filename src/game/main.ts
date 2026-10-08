// Inngangen til dungeonen. Siden kaller startDungeon(canvas), og herfra styres
// alt som skjer i spillet.

// Spillets egen oppløsning, i spillpiksler. Canvaset er nøyaktig så stort, og
// CSS skalerer det opp på skjermen. (I steg 2 regner vi dette ut fra kartet.)
const BREDDE = 368;
const HOYDE = 144;

// En firkant som beveger seg av seg selv. I steg 4 blir den til spilleren.
const boks = {
  x: 20, // posisjon i spillpiksler (øverste venstre hjørne av boksen)
  y: 66,
  storrelse: 12,
  fartX: 80, // spillpiksler per sekund. Negativ fart betyr mot venstre.
};

export function startDungeon(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // nettleseren støtter ikke canvas

  // Tidspunktet for forrige bilde, i millisekunder
  let forrigeTid = performance.now();

  function loop(naa: number): void {
    // TODO 1: Spill-løkken.
    // `naa` er tidspunktet for dette bildet i millisekunder, gitt av nettleseren.
    //
    // 1. Regn ut `dt`: hvor mange SEKUNDER som har gått siden forrige bilde.
    //    (Tips: forskjellen mellom naa og forrigeTid er i millisekunder.)
    // 2. Sett forrigeTid til naa, så neste runde regner fra riktig sted.
    // 3. Kall oppdater(dt), og deretter tegn(ctx).
    //    (TypeScript vet ikke at ctx fortsatt finnes her inne. Bruk ctx! eller
    //    sjekk if (ctx) først.)
    // 4. Be om neste bilde: requestAnimationFrame(loop).
    //
    // Bonus: Hva skjer hvis du bytter fane i 10 sekunder og kommer tilbake?
    // Da blir dt 10, og boksen hopper langt. Begrens dt, f.eks. med Math.min.
  }

  requestAnimationFrame(loop);
}

function oppdater(dt: number): void {
  // TODO 2: Flytt boksen.
  //
  // 1. Ny x = gammel x + fart × tid (bruk boks.x, boks.fartX og dt).
  // 2. Hvis boksen treffer høyre kant (boks.x + boks.storrelse > BREDDE)
  //    eller venstre kant (boks.x < 0), snu retningen: boks.fartX = -boks.fartX.
  //
  // Bonus: Hvis boksen har gått litt forbi kanten når du snur den, kan den bli
  // stående og "riste" der. Flytt den tilbake innenfor kanten samtidig.
}

function tegn(ctx: CanvasRenderingContext2D): void {
  // Mal hele flaten først. Uten dette ville vi sett et spor etter alle de
  // tidligere bildene, fordi canvas ikke visker ut noe av seg selv.
  ctx.fillStyle = '#1a1c22';
  ctx.fillRect(0, 0, BREDDE, HOYDE);

  // Math.round: tegn på hele spillpiksler, så boksen ikke blir uskarp i kantene
  ctx.fillStyle = '#f0a04b';
  ctx.fillRect(Math.round(boks.x), Math.round(boks.y), boks.storrelse, boks.storrelse);
}
