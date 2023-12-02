import { flow, pipe } from 'fp-ts/function';
import * as S from '@fp-ts/string';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as A from '@fp-ts/array';
import * as N from '@fp-ts/number';
import * as RA from '@fp-ts/ReadonlyArray';
import * as IO from 'fp-ts/IO';
import { puzzleInput } from './input.ts';

const pureLog =
  (message: string) =>
  (x: number): IO.IO<number> =>
  () => {
    console.log(`${message} ${x}`);
    return x;
  };

const toArrayOfWords = flow(S.trim, S.split('\n'));

type Game = {
  id: number;
  green: Array<number>;
  red: Array<number>;
  blue: Array<number>;
};

const extractCubeCount = (color: 'green' | 'red' | 'blue') =>
  flow(
    S.matchAll(new RegExp(`(\\d+)\\s${color}`, 'g')),
    O.map(
      NEA.map(
        A.match(
          () => O.none,
          xs => O.some(NEA.last(xs)),
        ),
      ),
    ),
    O.chain(NEA.sequence(O.Applicative)),
    O.chain(NEA.traverse(O.Applicative)(N.fromString)),
    O.match(
      () => [],
      x => [...x],
    ),
  );

const toGame = (s: string): Game => ({
  id: flow(
    S.match(/Game\s(\d+)/),
    O.map(NEA.last),
    O.chain(N.fromString),
    O.match(
      () => 0,
      x => x,
    ),
  )(s),
  green: extractCubeCount('green')(s),
  red: extractCubeCount('red')(s),
  blue: extractCubeCount('blue')(s),
});

const allDrawsSmallerThanMaxCubes = (maxCubes: number) =>
  A.every((x: number) => x <= maxCubes);

const isGamePossible = (game: Game): boolean =>
  allDrawsSmallerThanMaxCubes(14)(game.blue) &&
  allDrawsSmallerThanMaxCubes(13)(game.green) &&
  allDrawsSmallerThanMaxCubes(12)(game.red);

export const solvePart1: (input: string) => number = flow(
  toArrayOfWords,
  RNEA.map(toGame),
  RA.filter(isGamePossible),
  RA.map(g => g.id),
  RA.sum,
);

const minNumberOfRequiredCubes = A.match(() => 0, NEA.max(N.Ord));

export const solvePart2: (input: string) => number = flow(
  toArrayOfWords,
  RNEA.map(toGame),
  RNEA.map(
    g =>
      minNumberOfRequiredCubes(g.red) *
      minNumberOfRequiredCubes(g.blue) *
      minNumberOfRequiredCubes(g.green),
  ),
  RA.sum,
);

const part1 = pipe(puzzleInput, solvePart1, pureLog('Result of part 1:'));
const part2 = pipe(puzzleInput, solvePart2, pureLog('Result of part 2:'));

part1();
part2();
