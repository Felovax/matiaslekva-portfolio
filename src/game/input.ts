// Holder styr på tastaturet.
//
// To ulike spørsmål trengs i et spill:
//   - «Holdes tasten nede?»     Til bevegelse: man går så lenge tasten holdes.
//   - «Ble tasten trykket nå?»  Til handlinger: E skal åpne en dør én gang,
//                               ikke 60 ganger i sekundet mens den holdes.

// Tastene som er nede akkurat nå. Et Set er en samling uten duplikater, så det
// gjør ingenting at nettleseren sender keydown om og om igjen mens tasten holdes.
const nede = new Set<string>();

// Tastene som ble trykket siden forrige bilde. Tømmes etter hvert bilde.
const nyeTrykk = new Set<string>();

// Tastene spillet bruker. event.code er den fysiske tasten, ikke bokstaven,
// så WASD ligger på samme sted uansett tastaturoppsett.
const SPILLTASTER = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyE',
  'Space',
]);

// Spillet tar bare imot taster når dungeonen er synlig, og når det ikke er
// satt på pause (mens questloggen er åpen, eller under en dør-overgang).
// Ellers skal tastene virke som vanlig, f.eks. piltastene til å rulle siden.
let synlig = true;
let pauset = false;

export function erAktiv(): boolean {
  return synlig && !pauset;
}

// Holdes en tast nede, eller ble en trykket i dette bildet? Brukes til AFK.
export function harInput(): boolean {
  return nede.size > 0 || nyeTrykk.size > 0;
}

// Kalles fra main.ts når dungeonen kommer inn i eller går ut av bildet
export function settSynlig(verdi: boolean): void {
  synlig = verdi;
  slippHvisInaktiv();
}

// Kalles fra ui.ts når questloggen åpnes eller lukkes, og ved dør-overganger
export function settPauset(verdi: boolean): void {
  pauset = verdi;
  slippHvisInaktiv();
}

// Slipp alle taster når spillet blir inaktivt, så spilleren ikke går videre av seg selv
function slippHvisInaktiv(): void {
  if (!erAktiv()) {
    nede.clear();
    nyeTrykk.clear();
  }
}

// Begynner å lytte på tastaturet. Kalles én gang når spillet starter.
export function startInput(): void {
  window.addEventListener('keydown', (event) => {
    if (!erAktiv()) return; // la nettleseren håndtere tasten
    if (!SPILLTASTER.has(event.code)) return; // ikke en spilltast
    // Med Ctrl, Alt eller Cmd er det en snarvei, ikke spill. Alt + venstre pil
    // er f.eks. «tilbake» i nettleseren, og den skal aldri blokkeres.
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    // Står fokus i en knapp eller et skjemafelt, tilhører tasten den.
    // Mellomrom skal f.eks. trykke på knappen, ikke slå med sverdet.
    if (event.target instanceof Element && event.target.closest('button, input, select, textarea')) {
      return;
    }

    nede.add(event.code);
    // event.repeat er true når nettleseren gjentar tasten fordi den holdes inne.
    // Da er det ikke et nytt trykk.
    if (!event.repeat) {
      nyeTrykk.add(event.code);
    }
    // Hindrer at piltastene ruller siden mens man spiller
    event.preventDefault();
  });

  window.addEventListener('keyup', (event) => {
    nede.delete(event.code);
  });

  // Bytter man vindu mens en tast holdes, får vi aldri beskjed om at den slippes.
  // Da tømmer vi alt, så spilleren ikke fortsetter å gå av seg selv.
  window.addEventListener('blur', () => {
    nede.clear();
    nyeTrykk.clear();
  });
}

// Ble tasten trykket siden forrige bilde?
export function bleTrykket(kode: string): boolean {
  return nyeTrykk.has(kode);
}

// Kalles fra main.ts etter hvert bilde, så hvert trykk bare teller én gang
export function nullstillTrykk(): void {
  nyeTrykk.clear();
}

// Gir retningen spilleren vil gå i. x og y er hver -1, 0 eller 1.
// Holdes både venstre og høyre, opphever de hverandre og x blir 0.
export function hentRetning(): { x: number; y: number } {
  let x = 0;
  let y = 0;

  if (nede.has('KeyA') || nede.has('ArrowLeft')) {
    x -= 1;
  }
  if (nede.has('KeyD') || nede.has('ArrowRight')) {
    x += 1;
  }
  if (nede.has('KeyW') || nede.has('ArrowUp')) {
    y -= 1; // opp er minus, fordi y øker nedover på skjermen
  }
  if (nede.has('KeyS') || nede.has('ArrowDown')) {
    y += 1;
  }

  return { x, y };
}
