// Alt dungeonen viser som vanlig HTML oppå canvaset: skilt over dørene,
// hintet «E Gå til …», den mørke overgangen ved dørene og questloggen.
// Dette er den eneste spillfilen som rører HTML-en. Resten av spillet
// sier bare HVA som skal skje, og her bestemmes HVORDAN.
//
// Spillet regner i spillpiksler (368 × 160). Her gjøres de om til prosent av
// canvaset, så alt følger med når canvaset skaleres opp 2 × eller 3 ×.
import { settPauset } from './input';
import { BREDDE, HOYDE } from './kart';
import type { Objekt } from './objekter';

// HTML-elementene, hentet én gang i startUi
let flate: HTMLElement;
let hint: HTMLElement;
let hintTast: HTMLElement;
let hintTekst: HTMLElement;
let questlogg: HTMLDialogElement;
let melding: HTMLElement;
let status: HTMLElement;

// Hvor lenge den mørke overgangen tar, i millisekunder (samme som i CSS-en)
const OVERGANG_MS = 300;

function prosentX(x: number): string {
  return `${(x / BREDDE) * 100}%`;
}

function prosentY(y: number): string {
  return `${(y / HOYDE) * 100}%`;
}

// Gjør klar HTML-en. Kalles én gang når spillet starter.
export function startUi(objekter: Objekt[]): void {
  flate = hentElement('dungeon-flate');
  hint = hentElement('dungeon-hint');
  hintTast = hentElement('dungeon-hint-tast');
  hintTekst = hentElement('dungeon-hint-tekst');
  questlogg = hentElement('questlogg') as HTMLDialogElement;
  melding = hentElement('dungeon-melding');
  status = hentElement('dungeon-status');

  // Et skilt over hver dør, plassert midt over døren
  const skiltRad = hentElement('dungeon-skilt');
  for (const objekt of objekter) {
    if (objekt.type === 'dor') {
      const skilt = document.createElement('span');
      skilt.className = 'skilt';
      skilt.textContent = objekt.navn;
      skilt.style.left = prosentX(objekt.x);
      skiltRad.append(skilt);
    }
  }

  // Når questloggen lukkes (med Esc, knappen eller E), fortsetter spillet
  questlogg.addEventListener('close', () => settPauset(false));
  questlogg.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE') {
      // stopPropagation: tastetrykket skal ikke også nå spillet, ellers ville
      // det åpnet questloggen igjen med en gang
      event.stopPropagation();
      questlogg.close();
    }
  });
}

// Henter et element og sier tydelig fra hvis det mangler i HTML-en
function hentElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Dungeon: fant ikke elementet #${id}`);
  }
  return element;
}

// Det et hint består av: tasten, teksten, og punktet det skal stå over
export interface Hint {
  tast: string; // f.eks. «E» eller «Mellomrom»
  tekst: string; // f.eks. «Gå til Prosjekter»
  x: number; // i spillpiksler
  y: number;
}

// En tekst som beskriver hintet som vises nå. Hvis neste hint gir samme
// tekst, lar vi HTML-en være i fred. Posisjonen rundes til hele spillpiksler,
// så et hint som følger et skjelett bare oppdateres når det faktisk flytter seg.
let viser = '';

// Viser et hint, eller skjuler det hvis hint er undefined
export function visHint(ny: Hint | undefined): void {
  const beskrivelse = ny ? `${ny.tast}|${ny.tekst}|${Math.round(ny.x)}|${Math.round(ny.y)}` : '';
  if (beskrivelse === viser) return;
  viser = beskrivelse;

  if (!ny) {
    hint.hidden = true;
    return;
  }
  hintTast.textContent = ny.tast;
  hintTekst.textContent = ny.tekst;
  hint.style.left = prosentX(Math.round(ny.x));
  hint.style.top = prosentY(Math.round(ny.y));
  hint.hidden = false;
}

// Viser en kort melding øverst i dungeonen, f.eks. når et skjelett faller.
// Kommer det en ny melding før den forrige er borte, erstatter den den gamle.
let meldingTimer: number | undefined;

export function visMelding(tekst: string, varighetMs = 2500): void {
  melding.textContent = tekst;
  melding.classList.add('vis'); // CSS-en toner meldingen inn
  window.clearTimeout(meldingTimer); // avbryt nedtellingen til forrige melding
  meldingTimer = window.setTimeout(() => melding.classList.remove('vis'), varighetMs);
}

// Oppdaterer telleren under dungeonen
export function oppdaterStatus(xp: number, beseiret: number, totalt: number): void {
  status.textContent = `XP ${xp} · Skjeletter ${beseiret}/${totalt}`;
}

// Går gjennom en dør: mørkt over dungeonen, så rulles siden ned til seksjonen
export function gaaTilSeksjon(id: string): void {
  const seksjon = document.getElementById(id);
  if (!seksjon) return;

  // Mens overgangen pågår, skal ikke spilleren kunne gå eller trykke E
  settPauset(true);

  function fullfor(): void {
    // scrollIntoView følger CSS-en: myk rulling, eller hopp for dem som har
    // bedt om mindre bevegelse
    seksjon?.scrollIntoView();
    // Flytt tastaturfokus til overskriften, så Tab fortsetter derfra
    seksjon?.querySelector('h2')?.focus({ preventScroll: true });

    // Fjern mørket litt senere, når dungeonen allerede er ute av bildet
    setTimeout(() => {
      flate.classList.remove('morkt');
      settPauset(false);
    }, 600);
  }

  const mindreBevegelse = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mindreBevegelse) {
    fullfor(); // ingen overgang, rett til seksjonen
    return;
  }
  flate.classList.add('morkt'); // CSS-en toner inn et mørkt lag
  setTimeout(fullfor, OVERGANG_MS);
}

// Viser questloggen som et vindu over siden
export function visQuestlogg(): void {
  settPauset(true);
  // showModal: et ekte dialogvindu. Nettleseren flytter fokus inn i det,
  // lukker det med Esc og hindrer klikk på resten av siden.
  questlogg.showModal();
}

// Åpner en lenke i en ny fane. noopener og noreferrer: den nye siden får
// ikke tilgang til vår fane (samme sikkerhetsvalg som lenkene på siden).
export function aapneLenke(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
