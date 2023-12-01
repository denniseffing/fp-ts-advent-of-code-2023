import { flow, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as N from '@fp-ts/number';
import * as S from '@fp-ts/string';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from '@fp-ts/ReadonlyArray';
import * as IO from 'fp-ts/IO';
import { puzzleInput } from './input.ts';

// pureLog :: String -> Int -> IO Int
const pureLog =
  (message: string) =>
  (x: number): IO.IO<number> =>
  () => {
    console.log(`${message} ${x}`);
    return x;
  };

// toArrayOfWords :: String -> [String]
const toArrayOfWords = flow(S.trim, S.words);

// fromDigit :: String -> Maybe Int
const fromDigit = N.fromString;

// toMaybeList :: [Maybe a] -> Maybe [a]
const toMaybeList = flow(RA.filter(O.isSome), RA.sequence(O.Applicative));

// digitsOnly :: String -> Maybe [Int]
const digitsOnly = flow(S.split(''), RNEA.map(fromDigit), toMaybeList);

// firstAndLast :: [Int] -> Maybe Int
const firstAndLast = flow(
  RA.match(
    () => O.none,
    (xs: RNEA.ReadonlyNonEmptyArray<number>) =>
      O.some(10 * RNEA.head(xs) + RNEA.last(xs)),
  ),
);

// solve :: [String] -> Int
const solve = flow(
  RNEA.map(flow(digitsOnly, O.chain(firstAndLast))),
  toMaybeList,
  O.map(RA.sum),
  O.getOrElse(() => 0),
);

const part1 = pipe(
  puzzleInput,
  toArrayOfWords,
  solve,
  pureLog('Result of part 1:'),
);

part1();
