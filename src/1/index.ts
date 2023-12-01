import { puzzleInput } from './input.ts';
import * as S from '@fp-ts/string';
import * as O from 'fp-ts/Option';
import * as N from '@fp-ts/number';
import { flow, pipe } from 'fp-ts/function';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RA from '@fp-ts/ReadonlyArray';
import * as IO from 'fp-ts/IO';
import * as NES from 'fp-ts-std/NonEmptyString';
import * as R from 'fp-ts/Record';

const pureLog =
  (message: string) =>
  (x: number): IO.IO<number> =>
  () => {
    console.log(`${message} ${x}`);
    return x;
  };

const toArrayOfWords = flow(S.trim, S.words);

const concatFirstAndLastDigits = flow(NES.unsafeFromString, s =>
  NES.toString(NES.Semigroup.concat(NES.head(s), NES.last(s))),
);

const digitsOnly = S.under(RA.filter(S.test(/\d/g)));

const wordToDigitMap: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  zero: '0',
};

const replace =
  (pattern: RegExp) =>
  (replacer: (matched: string) => string) =>
  (input: string) =>
    input.replace(pattern, replacer);

const replaceDigits = replace(
  /one|two|three|four|five|six|seven|eight|nine|zero/gi,
);

const digitLiteralToDigit = (s: string) =>
  pipe(
    wordToDigitMap,
    R.lookup(s),
    O.getOrElse(() => s),
  );

const replaceDigitLiteralsWithDigits = replaceDigits(digitLiteralToDigit);

export const part1 = pipe(
  puzzleInput,
  toArrayOfWords,
  RNEA.map(digitsOnly),
  RNEA.map(concatFirstAndLastDigits),
  RNEA.traverse(O.Applicative)(N.fromString),
  O.map(RA.sum),
  O.getOrElse(() => 0),
  pureLog('Result of part 1:'),
);

export const part2 = pipe(
  puzzleInput,
  toArrayOfWords,
  RNEA.map(replaceDigitLiteralsWithDigits),
  RNEA.map(digitsOnly),
  RNEA.map(concatFirstAndLastDigits),
  RNEA.traverse(O.Applicative)(N.fromString),
  O.map(RA.sum),
  O.getOrElse(() => 0),
  pureLog('Result of part 2:'),
);

part1();
part2();
