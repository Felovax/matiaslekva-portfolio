// Holder styr på hvilke taster som er nede akkurat nå.
//
// Spillet reagerer ikke på hvert enkelt tastetrykk. I stedet spør det hvert
// bilde: «hvilke taster holdes nede nå?». Det gir jevn bevegelse så lenge
// tasten holdes, uten hakking.

// Tastene som er nede akkurat nå. Et Set er en samling uten duplikater, så det
// gjør ingenting at nettleseren sender keydown om og om igjen mens tasten holdes.
const nede = new Set<string>();

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
]);

// Begynner å lytte på tastaturet. Kalles én gang når spillet starter.
export function startInput(): void {
  window.addEventListener('keydown', (event) => {
    if (!SPILLTASTER.has(event.code)) return; // ikke en spilltast, la nettleseren håndtere den

    nede.add(event.code);
    // Hindrer at piltastene ruller siden mens man spiller.
    // (Steg 7: dette må bare skje når dungeonen er i bruk, ikke når man leser siden.)
    event.preventDefault();
  });

  window.addEventListener('keyup', (event) => {
    nede.delete(event.code);
  });

  // Bytter man vindu mens en tast holdes, får vi aldri beskjed om at den slippes.
  // Da tømmer vi alt, så spilleren ikke fortsetter å gå av seg selv.
  window.addEventListener('blur', () => {
    nede.clear();
  });
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
