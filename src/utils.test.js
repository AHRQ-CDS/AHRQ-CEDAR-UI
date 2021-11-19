import { conceptIsSelected } from './utils';
import { concepts, hypertensiveDisease, hypertension, diabeticFoot } from '../fixtures/concepts';


it('returns true if the newly-selected concept is the only selected concept', () => {
  const selectedConcepts = []

  expect(conceptIsSelected(hypertensiveDisease, selectedConcepts)).toBe(false)
});

it('returns true if the newly-selected concept is the same as the previously-selected concept', () => {
  const selectedConcepts = [hypertensiveDisease, diabeticFoot]

  expect(conceptIsSelected(hypertensiveDisease, selectedConcepts)).toBe(true)
});

it('returns true if the newly-selected concept is a subset of a previously-selected concept', () => {
  const selectedConcepts = [hypertensiveDisease, diabeticFoot]

  expect(conceptIsSelected(hypertension, selectedConcepts)).toBe(true)
});

it('returns false if the newly-selected concept is not a subset of a previously-selected concept and is narrower than the previously-selected concept', () => {
  const selectedConcepts = [hypertension, diabeticFoot]

  expect(conceptIsSelected(hypertensiveDisease, selectedConcepts)).toBe(false)
});