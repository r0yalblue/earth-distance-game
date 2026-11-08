// Play mode: guess the distance between two national capitals over three rounds.

import { formatNumber } from './geo.js';
import { scoreGuess, errorFraction } from './scoring.js';
import { pickPairs, resultText, ROUNDS } from './game.js';

let capitalsPromise;
const loadCapitals = () => (capitalsPromise ??= fetch('data/capitals.json').then(r => {
  if (!r.ok) throw new Error(`capitals.json returned ${r.status}`);
  return r.json();
}));

export function createPlay(root, globe) {
  const $ = selector => root.querySelector(selector);
  const question = $('.play-question');
  const reveal = $('.play-reveal');
  const summary = $('.play-summary');
  const form = $('.play-form');
  const input = $('.play-input');

  let rounds = [];
  let current = 0;

  function showCard(card) {
    for (const c of [question, reveal, summary]) c.hidden = c !== card;
  }

  // "How far is Paris, France from Lima, Peru?" with the capitals in bold.
  function setPrompt(el, a, b) {
    const strong = text => Object.assign(document.createElement('strong'), { textContent: text });
    el.replaceChildren(
      'How far is ', strong(a.capital), `, ${a.country} from `, strong(b.capital), `, ${b.country}?`
    );
  }

  function askRound() {
    const round = rounds[current];
    globe.clear();
    globe.setAutoRotate(true);
    $('.play-question .play-round').textContent = `Round ${current + 1} of ${ROUNDS}`;
    setPrompt($('.play-prompt'), round.a, round.b);
    input.value = '';
    showCard(question);
    input.focus();
  }

  function revealRound(guessKm) {
    const round = rounds[current];
    round.guessKm = guessKm;
    round.score = scoreGuess(guessKm, round.actualKm);

    globe.setAutoRotate(false);
    globe.showRoute(
      { ...round.a, name: `${round.a.capital}, ${round.a.country}` },
      { ...round.b, name: `${round.b.capital}, ${round.b.country}` },
      round.actualKm
    );

    const pctOff = Math.round(errorFraction(guessKm, round.actualKm) * 100);
    $('.play-reveal .play-round').textContent = `Round ${current + 1} of ${ROUNDS}`;
    setPrompt($('.play-reveal .play-pair'), round.a, round.b);
    $('.play-points').textContent = `${round.score} points`;
    $('.play-detail').textContent =
      `Actual ${formatNumber(round.actualKm)} km · You guessed ${formatNumber(guessKm)} km · ${pctOff}% off`;
    $('.play-next').textContent = current + 1 < ROUNDS ? 'Next round' : 'See result';
    showCard(reveal);
    $('.play-next').focus();
  }

  function showSummary() {
    const total = rounds.reduce((sum, r) => sum + r.score, 0);
    globe.setAutoRotate(true);
    $('.play-total').textContent = `${total} / ${ROUNDS * 100}`;
    $('.play-lines').replaceChildren(...rounds.map(r => {
      const li = document.createElement('li');
      li.textContent = `${r.a.capital} → ${r.b.capital}: ${r.score} (actual ${formatNumber(r.actualKm)} km, guessed ${formatNumber(r.guessKm)} km)`;
      return li;
    }));
    $('.play-copied').textContent = '';
    showCard(summary);
  }

  async function newGame() {
    try {
      rounds = pickPairs(await loadCapitals());
    } catch {
      $('.play-question .play-round').textContent = '';
      $('.play-prompt').textContent = 'Could not load the capitals. Try reloading the page.';
      showCard(question);
      return;
    }
    current = 0;
    askRound();
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const guessKm = Number(input.value);
    if (!Number.isFinite(guessKm) || guessKm <= 0) { input.focus(); return; }
    revealRound(guessKm);
  });

  $('.play-next').addEventListener('click', () => {
    current += 1;
    if (current < ROUNDS) askRound(); else showSummary();
  });

  $('.play-again').addEventListener('click', newGame);

  $('.play-copy').addEventListener('click', async () => {
    const text = resultText(rounds);
    try {
      await navigator.clipboard.writeText(text);
      $('.play-copied').textContent = 'Copied. Paste it into a chat to challenge your friends.';
    } catch {
      // Clipboard can be blocked (e.g. some in-app browsers): show the text to copy by hand.
      $('.play-copied').textContent = text;
    }
  });

  return {
    enter() { newGame(); },
    exit() { globe.setAutoRotate(false); globe.clear(); },
  };
}
