import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreGuess, errorFraction } from '../js/scoring.js';

test('a perfect guess scores 100', () => {
  assert.equal(scoreGuess(10000, 10000), 100);
});

test("Jeremy's worked example: actual 10,000 km, guess 4,000 km scores 40", () => {
  assert.equal(errorFraction(4000, 10000), 0.6);
  assert.equal(scoreGuess(4000, 10000), 40);
});

test('over- and under-guessing by the same amount score the same', () => {
  assert.equal(scoreGuess(9000, 10000), 90);
  assert.equal(scoreGuess(11000, 10000), 90);
  assert.equal(scoreGuess(16000, 10000), 40);
});

test('score never goes below zero', () => {
  assert.equal(scoreGuess(20000, 10000), 0);
  assert.equal(scoreGuess(25000, 10000), 0);
});

test('scores are whole numbers', () => {
  // 6,000 against 6,807 is 11.86% off, i.e. 88.14 points, shown as 88.
  assert.equal(scoreGuess(6000, 6807), 88);
});
