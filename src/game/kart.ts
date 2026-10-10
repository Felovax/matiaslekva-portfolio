// Kartet over dungeonen, skrevet som tekst. Hvert tegn er én rute.
// Endrer du kartet her, endrer dungeonen seg. Alle rader må være like lange.
//
//   #  vegg              .  gulv
//   O  dør: Om meg       P  dør: Prosjekter      (dørene er to ruter brede)
//   E  dør: Erfaring     K  dør: Kontakt
//   T  fakkel på veggen  x  sprukket vegg (hemmelig)
//   u  nisje med gummiand (det x blir til når veggen raser)
//   @  start             Q  questlogg
//   g  GitHub-portal     l  LinkedIn-portal
//   S  startpunkt for et skjelett (selve skjelettene styres i skjeletter.ts)
import { SPRITES, tegnSprite, type Sprite } from './sprites';

export const KART = [
  '#######################',
  '#T#OO#T#PP#T#EE#T#KK#T#',
  '#.....................#',
  '#...S.............S...#',
  '#.....................#',
  'x.......S.....S.......#',
  '#.....................#',
  '#..S.......@Q......S..#',
  '#..g...............l..#',
  '#######################',
];

// Hver rute er 16 × 16 spillpiksler, samme størrelse som rutene i grafikken
export const RUTE = 16;

export const KOLONNER = KART[0].length;
export const RADER = KART.length;

// Spillets oppløsning regnes ut fra kartet: 23 × 16 = 368 og 10 × 16 = 160
export const BREDDE = KOLONNER * RUTE;
export const HOYDE = RADER * RUTE;

// Hva som tegnes UNDER hvert tegn: vegg eller gulv.
// (Hvor man kan GÅ, er et eget spørsmål. Det styres av GANGBARE lenger ned.)
const VEGGTEGN = new Set(['#', 'x', 'u', 'O', 'P', 'E', 'K', 'T']);
const GULVTEGN = new Set(['.', '@', 'S', 'Q', 'g', 'l']);

// Brukes hvis kartet har et tegn vi ikke kjenner. Knallrosa er en gammel
// spilltradisjon for «her mangler noe», fordi feilen da er umulig å overse.
const MANGLER_FARGE = '#ff00ff';

// Tegner hele kartet. tid (sekunder siden start) brukes til animasjoner.
export function tegnKart(ctx: CanvasRenderingContext2D, tid: number): void {
  // Runde 1: bakgrunnen i hver rute, altså vegg eller gulv
  for (let rad = 0; rad < RADER; rad++) {
    for (let kol = 0; kol < KOLONNER; kol++) {
      const tegn = KART[rad][kol];
      const x = kol * RUTE;
      const y = rad * RUTE;

      if (VEGGTEGN.has(tegn)) {
        const vegg = veggbit(kol, rad);
        tegnSprite(ctx, vegg.sprite, x, y, { speilY: vegg.oppNed });
      } else if (GULVTEGN.has(tegn)) {
        tegnSprite(ctx, gulvbit(kol, rad), x, y);
      } else {
        ctx.fillStyle = MANGLER_FARGE;
        ctx.fillRect(x, y, RUTE, RUTE);
      }
    }
  }

  // Runde 2: det som står oppå bakgrunnen. Dørene er bredere enn én rute og
  // dekker nabo-rutene, så alt dette må tegnes etter at bakgrunnen er ferdig.
  for (let rad = 0; rad < RADER; rad++) {
    for (let kol = 0; kol < KOLONNER; kol++) {
      const tegn = KART[rad][kol];
      const x = kol * RUTE;
      const y = rad * RUTE;

      switch (tegn) {
        case 'O':
        case 'P':
        case 'E':
        case 'K':
          // En dør er to like tegn ved siden av hverandre. Tegn den bare én
          // gang, ved det første av de to.
          if (kol === 0 || KART[rad][kol - 1] !== tegn) {
            tegnDor(ctx, x, y);
          }
          break;
        case 'T':
          tegnFakkel(ctx, x, y, tid);
          break;
        case 'x':
          tegnSprekk(ctx, x, y);
          break;
        case 'u':
          tegnNisjeMedAnd(ctx, x, y);
          break;
        case 'Q':
          tegnQuestlogg(ctx, x, y);
          break;
        case 'g':
          tegnPortal(ctx, x, y, '#e6edf3', tid); // GitHub: lys grå
          break;
        case 'l':
          tegnPortal(ctx, x, y, '#0a66c2', tid); // LinkedIn: blå
          break;
      }
    }
  }
}

// Velger riktig veggbit ut fra hvor i rommet ruten ligger.
// Reglene passer et rektangulært rom som vårt. Et spill med rom i alle
// former ville sett på nabo-rutene i stedet (det kalles «autotiling»).
function veggbit(kol: number, rad: number): { sprite: Sprite; oppNed: boolean } {
  const sisteKol = KOLONNER - 1;
  const sisteRad = RADER - 1;

  // Øverste rad: den lyse kanten på toppen av bakveggen
  if (rad === 0) {
    if (kol === 0) return { sprite: SPRITES.veggToppVenstre, oppNed: false };
    if (kol === sisteKol) return { sprite: SPRITES.veggToppHoyre, oppNed: false };
    return { sprite: SPRITES.veggToppMidt, oppNed: false };
  }
  // Andre rad: mursteinsfronten på bakveggen
  if (rad === 1) {
    if (kol === 0) return { sprite: SPRITES.veggFrontVenstre, oppNed: false };
    if (kol === sisteKol) return { sprite: SPRITES.veggFrontHoyre, oppNed: false };
    return { sprite: SPRITES.veggFrontMidt, oppNed: false };
  }
  // Nederste rad: toppkanten av bunnveggen. Vi gjenbruker toppkanten,
  // snudd opp-ned, så den lyse kanten ligger inntil gulvet.
  if (rad === sisteRad) {
    if (kol === 0) return { sprite: SPRITES.hjorneNedeVenstre, oppNed: true };
    if (kol === sisteKol) return { sprite: SPRITES.hjorneNedeHoyre, oppNed: true };
    return { sprite: SPRITES.veggToppMidt, oppNed: true };
  }
  // Sideveggene
  if (kol === 0) return { sprite: SPRITES.veggSideVenstre, oppNed: false };
  if (kol === sisteKol) return { sprite: SPRITES.veggSideHoyre, oppNed: false };

  // En vegg midt i rommet (finnes ikke i kartet nå): vis den som murstein
  return { sprite: SPRITES.veggFrontMidt, oppNed: false };
}

// Velger gulvbit for en rute. De fleste rutene er vanlig gulv, noen få har sprekker.
// «Tilfeldigheten» regnes ut fra rutens posisjon, så samme rute alltid får
// samme gulv. Ekte tilfeldige tall ville gitt nytt gulv hvert bilde, og
// gulvet ville flimret.
function gulvbit(kol: number, rad: number): Sprite {
  const tall = (kol * 37 + rad * 91 + kol * rad * 17) % 100; // et tall fra 0 til 99
  if (tall < 82) {
    return SPRITES.gulvVanlig;
  }
  return SPRITES.gulvSprukket[tall % SPRITES.gulvSprukket.length];
}

// En dør er 2 × 2 ruter og står i veggfronten, så den starter én rad over
// (i toppkanten) og dekker begge radene. Karmen står på hver side.
function tegnDor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const topp = y - RUTE;
  tegnSprite(ctx, SPRITES.dorKarmVenstre, x - RUTE, topp);
  tegnSprite(ctx, SPRITES.dorKarmHoyre, x + 2 * RUTE, topp);
  tegnSprite(ctx, SPRITES.dorBlad, x, topp);
}

// Grafikkpakken har ingen fakler, så vi tegner en selv med små firkanter.
// Flammen bytter mellom to former for å se levende ut. Lyset kommer i fase 5.
function tegnFakkel(ctx: CanvasRenderingContext2D, x: number, y: number, tid: number): void {
  const blaff = Math.floor(tid * 6) % 2; // 0 eller 1, bytter seks ganger i sekundet

  ctx.fillStyle = '#4a2f1b'; // holderen
  ctx.fillRect(x + 7, y + 8, 2, 6);
  ctx.fillRect(x + 6, y + 13, 4, 1);

  ctx.fillStyle = '#e0662f'; // ytre flamme
  ctx.fillRect(x + 6, y + 3 + blaff, 4, 6 - blaff);
  ctx.fillRect(x + 7, y + 1 + blaff, 2, 2);

  ctx.fillStyle = '#ffd89a'; // indre flamme
  ctx.fillRect(x + 7, y + 5, 2, 3);
}

// Den sprukne veggen: mørke sprekker i den lyse veggkanten, og noen småstein
// som har falt ut på gulvet foran. Et lite hint for den som ser etter.
function tegnSprekk(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#1b1720'; // sprekkene
  ctx.fillRect(x + 12, y + 5, 4, 1);
  ctx.fillRect(x + 13, y + 6, 2, 2);
  ctx.fillRect(x + 12, y + 9, 3, 1);

  ctx.fillStyle = '#8f8276'; // småstein på gulvruten til høyre
  ctx.fillRect(x + 18, y + 11, 2, 1);
  ctx.fillRect(x + 21, y + 13, 1, 1);
  ctx.fillRect(x + 17, y + 14, 1, 1);
}

// Nisjen som dukker opp når veggen raser, med en gummiand som ser inn i rommet
function tegnNisjeMedAnd(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#070609'; // hullet i veggen
  ctx.fillRect(x + 3, y + 2, 13, 13);

  ctx.fillStyle = '#f5c518'; // kropp og hode
  ctx.fillRect(x + 5, y + 9, 8, 4);
  ctx.fillRect(x + 9, y + 6, 4, 4);

  ctx.fillStyle = '#f08a24'; // nebbet
  ctx.fillRect(x + 13, y + 8, 2, 1);

  ctx.fillStyle = '#111111'; // øyet
  ctx.fillRect(x + 11, y + 7, 1, 1);
}

// En oppslått bok på gulvet: brunt omslag, to lyse sider og noen tekstlinjer
function tegnQuestlogg(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#6b3f23'; // omslaget
  ctx.fillRect(x + 1, y + 5, 14, 9);

  ctx.fillStyle = '#efe3c8'; // sidene
  ctx.fillRect(x + 2, y + 5, 5, 7);
  ctx.fillRect(x + 9, y + 5, 5, 7);

  ctx.fillStyle = '#b9a98c'; // ryggen i midten og tekstlinjene
  ctx.fillRect(x + 7, y + 5, 2, 8);
  ctx.fillRect(x + 3, y + 7, 3, 1);
  ctx.fillRect(x + 10, y + 7, 3, 1);
  ctx.fillRect(x + 3, y + 9, 3, 1);
  ctx.fillRect(x + 10, y + 9, 2, 1);
}

// En portal: en oval ring i portalens farge, med mørk kjerne som «puster»
function tegnPortal(ctx: CanvasRenderingContext2D, x: number, y: number, farge: string, tid: number): void {
  const puls = Math.floor(tid * 3) % 2; // kjernen veksler mellom to størrelser

  ctx.fillStyle = farge;
  ctx.fillRect(x + 5, y + 1, 6, 14);
  ctx.fillRect(x + 3, y + 3, 10, 10);

  ctx.fillStyle = '#0d0e12';
  ctx.fillRect(x + 6, y + 4 + puls, 4, 8 - 2 * puls);
  ctx.fillRect(x + 5, y + 6, 6, 4);
}

// ---------------------------------------------------------------------------
// Kollisjon: hvor man kan gå

// Rutene man kan gå på. Alt annet er massivt, også tegn vi ikke kjenner.
// Det er tryggere å liste opp det som er lov enn alt som ikke er lov: glemmer
// vi et tegn, blir det en vegg og ikke et hull. Samme prinsipp som en
// allowlist i sikkerhet.
// S er bare et startpunkt for et skjelett, så ruten er vanlig gulv. Selve
// skjelettene er figurer, og kollisjon med dem håndteres i figur.ts.
const GANGBARE = new Set(['.', '@', 'S']);

// En bitteliten avstand. Den trekkes fra høyre- og bunnkanten når vi regner ut
// hvilke ruter noe dekker, så det å stå akkurat inntil en vegg ikke regnes som
// å stå inni den.
export const LITT = 0.001;

// Er ruten massiv? Ruter utenfor kartet regnes også som massive, så ingenting
// kan gå ut av kartet.
export function erMassiv(kol: number, rad: number): boolean {
  if (rad < 0 || rad >= RADER || kol < 0 || kol >= KOLONNER) {
    return true;
  }
  return !GANGBARE.has(KART[rad][kol]);
}

// Overlapper rektangelet (x, y, bredde, høyde) minst én massiv rute?
export function kolliderer(x: number, y: number, bredde: number, hoyde: number): boolean {
  // Hvilke kolonner og rader dekker rektangelet? Fra rektangelets venstre/øvre
  // kant til høyre/nedre kant, regnet om fra piksler til ruter.
  const forsteKol = Math.floor(x / RUTE);
  const sisteKol = Math.floor((x + bredde - LITT) / RUTE);
  const forsteRad = Math.floor(y / RUTE);
  const sisteRad = Math.floor((y + hoyde - LITT) / RUTE);

  // Sjekk hver av disse rutene. <= fordi både første og siste rute skal med.
  for (let rad = forsteRad; rad <= sisteRad; rad++) {
    for (let kol = forsteKol; kol <= sisteKol; kol++) {
      if (erMassiv(kol, rad)) {
        return true;
      }
    }
  }
  return false;
}

// Endrer én rute i kartet mens spillet går, f.eks. når den sprukne veggen raser.
// En tekst kan ikke endres bit for bit i JavaScript, så vi lager en ny rad:
// alt før ruten + det nye tegnet + alt etter ruten.
export function settRute(kol: number, rad: number, tegn: string): void {
  const gammel = KART[rad];
  KART[rad] = gammel.slice(0, kol) + tegn + gammel.slice(kol + 1);
}

// Finner første rute med et gitt tegn, f.eks. '@' for startposisjonen.
// Gir undefined hvis tegnet ikke finnes i kartet.
export function finnRute(tegn: string): { kol: number; rad: number } | undefined {
  for (let rad = 0; rad < RADER; rad++) {
    // indexOf gir plassen til tegnet i raden, eller -1 hvis det ikke er der
    const kol = KART[rad].indexOf(tegn);
    if (kol !== -1) {
      return { kol, rad };
    }
  }
  return undefined;
}

// Sjekk under utvikling: si fra i Console hvis en rad har feil lengde.
for (let rad = 0; rad < RADER; rad++) {
  if (KART[rad].length !== KOLONNER) {
    console.warn(`Kartet: rad ${rad} har ${KART[rad].length} tegn, forventet ${KOLONNER}`);
  }
}
