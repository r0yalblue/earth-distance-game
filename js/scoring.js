// Scoring for Play mode. Pure functions, so they can be unit tested in Node.

export const MAX_ROUND_SCORE = 100;

// How far off the guess was, as a fraction of the actual distance (0.12 = 12% off).
export const errorFraction = (guessKm, actualKm) => Math.abs(guessKm - actualKm) / actualKm;

// 100 for a perfect guess, falling linearly to 0 at 100% off; never negative.
// Example: actual 10,000 km, guess 4,000 km -> 60% off -> 40 points.
export function scoreGuess(guessKm, actualKm) {
  const score = MAX_ROUND_SCORE * (1 - errorFraction(guessKm, actualKm));
  return Math.max(0, Math.round(score));
}
