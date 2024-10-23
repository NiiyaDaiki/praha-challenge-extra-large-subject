import { v4 as uuid } from 'uuid'

export const createRandomIdString = () => {
  return uuid()
}

export const getRandomInt = (min: number, max: number) => {
  // min（含む）からmax（含む）の範囲でランダムな整数を生成する
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type SingleChar = `${string}` extends infer T ? T extends string ? T[0] : never : never;

export const getRandomChar = (startChar: SingleChar, endChar: SingleChar) => {
  if (startChar.length !== 1 || endChar.length !== 1) {
    throw new Error("Both arguments must be single characters.");
  }

  const start = startChar.charCodeAt(0);
  const end = endChar.charCodeAt(0);

  // start（含む）からend（含む）の範囲でランダムな文字を生成する
  const randomCharCode = Math.floor(Math.random() * (end - start + 1)) + start;
  return String.fromCharCode(randomCharCode);
}