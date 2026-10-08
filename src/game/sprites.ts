// Pikselgrafikk fra 0x72 «16x16 DungeonTileset II» (CC0-lisens):
// https://0x72.itch.io/dungeontileset-ii
//
// All grafikken ligger i ett bilde, et såkalt spritesheet. En sprite er et
// rektangulært utsnitt av det bildet. Det er raskere å laste ett bilde enn
// hundre små, og vi trenger bare å vite hvor hver figur ligger.
// Koordinatene under er hentet fra tile_list_v1.7, som følger med pakken.

export interface Sprite {
  x: number; // hvor i spritesheetet utsnittet starter
  y: number;
  b: number; // bredde
  h: number; // høyde
}

// Liten hjelper så tabellen under blir kort. De fleste spritene er 16 × 16.
function sprite(x: number, y: number, b = 16, h = 16): Sprite {
  return { x, y, b, h };
}

export const SPRITES = {
  gulvVanlig: sprite(16, 64),
  gulvSprukket: [
    sprite(32, 64),
    sprite(48, 64),
    sprite(16, 80),
    sprite(32, 80),
    sprite(48, 80),
    sprite(16, 96),
    sprite(32, 96),
  ],

  // Toppveggen er to ruter høy: øverst den lyse kanten, under den mursteinsfronten
  veggToppVenstre: sprite(16, 0),
  veggToppMidt: sprite(32, 0),
  veggToppHoyre: sprite(48, 0),
  veggFrontVenstre: sprite(16, 16),
  veggFrontMidt: sprite(32, 16),
  veggFrontHoyre: sprite(48, 16),

  // Sideveggene sees ovenfra, som en tynn kant mot gulvet
  veggSideVenstre: sprite(48, 152), // kanten ligger på høyre side av ruten
  veggSideHoyre: sprite(32, 152), // kanten ligger på venstre side av ruten
  // Små biter der sideveggene møter bunnveggen (tegnes speilvendt opp-ned)
  hjorneNedeVenstre: sprite(0, 136),
  hjorneNedeHoyre: sprite(16, 136),

  // Dørene er 2 × 2 ruter, med en karm på hver side
  dorBlad: sprite(32, 240, 32, 32),
  dorKarmVenstre: sprite(16, 240, 16, 32),
  dorKarmHoyre: sprite(64, 240, 16, 32),

  // Animasjoner er lister med bilder som vises etter hverandre
  ridderStaar: [
    sprite(128, 100, 16, 28),
    sprite(144, 100, 16, 28),
    sprite(160, 100, 16, 28),
    sprite(176, 100, 16, 28),
  ],
  ridderLoper: [
    sprite(192, 100, 16, 28),
    sprite(208, 100, 16, 28),
    sprite(224, 100, 16, 28),
    sprite(240, 100, 16, 28),
  ],
  skjelett: [sprite(368, 88), sprite(384, 88), sprite(400, 88), sprite(416, 88)],
};

// Selve bildet. Det lastes én gang, før spillet starter.
const bilde = new Image();

export async function lastInnSprites(): Promise<void> {
  // Lokalt ligger siden på "/", på GitHub Pages under "/matiaslekva-portfolio/"
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  bilde.src = `${base}sprites/dungeon.png`;
  // decode() venter til bildet er ferdig lastet og klart til å tegnes.
  // Feiler lastingen, kaster den en feil som main.ts fanger opp.
  await bilde.decode();
}

// Tegner én sprite på (x, y). speilX snur den mot venstre, speilY snur den opp-ned.
export function tegnSprite(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x: number,
  y: number,
  valg: { speilX?: boolean; speilY?: boolean } = {},
): void {
  // Hele piksler, ellers blir pikselgrafikken uskarp
  const px = Math.round(x);
  const py = Math.round(y);

  if (!valg.speilX && !valg.speilY) {
    // drawImage med ni tall: hent utsnittet (s.x, s.y, s.b, s.h) fra bildet,
    // og tegn det på (px, py) i samme størrelse
    ctx.drawImage(bilde, s.x, s.y, s.b, s.h, px, py, s.b, s.h);
    return;
  }

  // For å speilvende flytter vi tegnepunktet til motsatt kant av spriten og
  // snur aksen med scale(-1). save/restore setter alt tilbake etterpå, så
  // resten av tegningen ikke blir speilvendt.
  ctx.save();
  ctx.translate(px + (valg.speilX ? s.b : 0), py + (valg.speilY ? s.h : 0));
  ctx.scale(valg.speilX ? -1 : 1, valg.speilY ? -1 : 1);
  ctx.drawImage(bilde, s.x, s.y, s.b, s.h, 0, 0, s.b, s.h);
  ctx.restore();
}

// Velger hvilket bilde i en animasjon som skal vises nå.
// tid er sekunder siden start, fps er bilder per sekund i animasjonen.
// forskyvning lar like figurer være i takt med hver sin animasjon.
export function animasjonsbilde(bilder: Sprite[], tid: number, fps: number, forskyvning = 0): Sprite {
  return bilder[(Math.floor(tid * fps) + forskyvning) % bilder.length];
}
