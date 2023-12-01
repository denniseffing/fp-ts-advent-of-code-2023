import { expect, test } from 'bun:test';
import { part1, part2 } from './index.ts';

test('part1 returns correct result', () => {
  expect(part1()).toEqual(54561);
});

test('part2 returns correct result', () => {
  expect(part2()).toEqual(54076);
});
