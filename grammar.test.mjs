import assert from "node:assert/strict";
import { test } from "node:test";

import * as hegel from "@hegeldev/hegel";
import * as gs from "@hegeldev/hegel/generators";
import Parser from "tree-sitter";

import Fsl from "./bindings/node/index.js";

const TEST_CASES = readTestCases();
const SETTINGS = { seed: 1709, testCases: TEST_CASES };
const parser = new Parser();

parser.setLanguage(Fsl);

function readTestCases() {
  const value = Number.parseInt(process.env.HEGEL_CASES ?? "100", 10);
  if (!Number.isSafeInteger(value) || value < 1 || value > 5_000) {
    throw new Error("HEGEL_CASES must be an integer from 1 through 5000");
  }
  return value;
}

function parseSource(source) {
  const tree = parser.parse(source);
  return !tree.rootNode.hasError;
}

const identifier = gs.fromRegex("[A-Za-z_][A-Za-z0-9_-]{0,31}");
const number = gs.text({ alphabet: "0123456789", minSize: 1, maxSize: 64 });
// Tree-sitter reserves NUL as its input sentinel, so it is not valid source text.
const stringContent = gs.text({
  maxSize: 32,
  excludeCharacters: '\u0000"\\\n\r',
});
const commentContent = gs.text({
  maxSize: 48,
  excludeCharacters: "\u0000\n\r",
});
const operator = gs.sampledFrom([
  "=>",
  "~>",
  "||",
  "->",
  "==",
  "!=",
  "<=",
  ">=",
  "..",
  "+",
  "-",
  "*",
  "/",
  "%",
  "<",
  ">",
  "=",
]);
const punctuation = gs.sampledFrom(["{", "}", "(", ")", "[", "]", ",", ":", ";", "."]);

const token = gs.composite((tc) => {
  const kind = tc.draw(
    gs.sampledFrom([
      "identifier",
      "number",
      "string",
      "annotation",
      "operator",
      "punctuation",
      "comment",
    ]),
  );

  switch (kind) {
    case "identifier":
      return { text: tc.draw(identifier), lineTerminated: false };
    case "number":
      return { text: tc.draw(number), lineTerminated: false };
    case "string":
      return { text: `"${tc.draw(stringContent)}"`, lineTerminated: false };
    case "annotation":
      return { text: `@${tc.draw(identifier)}`, lineTerminated: false };
    case "operator":
      return { text: tc.draw(operator), lineTerminated: false };
    case "punctuation":
      return { text: tc.draw(punctuation), lineTerminated: false };
    case "comment":
      return { text: `//${tc.draw(commentContent)}`, lineTerminated: true };
    default:
      throw new Error(`unsupported generated token kind: ${kind}`);
  }
});

const separator = gs.sampledFrom([" ", "\t", "\n", "\r\n", "\uFEFF", "\u2060", "\u200B"]);

function renderTokens(tc, tokens) {
  let source = "";

  for (const current of tokens) {
    source += current.text;
    source += current.lineTerminated ? "\n" : tc.draw(separator);
  }

  return source;
}

const validProgram = gs.composite((tc) => {
  const tokens = tc.draw(gs.arrays(token, { maxSize: 40 }));
  return renderTokens(tc, tokens);
});

const invalidProgram = gs.composite((tc) => {
  const tokens = tc.draw(gs.arrays(token, { maxSize: 40 }));
  const insertionIndex = tc.draw(
    gs.integers({
      minValue: 0,
      maxValue: tokens.length,
    }),
  );
  const invalidCharacter = tc.draw(gs.sampledFrom(["#", "?", "'", "&", "!", "`", "\\"]));
  const prefix = renderTokens(tc, tokens.slice(0, insertionIndex));
  const suffix = renderTokens(tc, tokens.slice(insertionIndex));
  return `${prefix}\n${invalidCharacter}\n${suffix}`;
});

test("generated valid token programs parse without recovery nodes", () => {
  let completedCases = 0;

  hegel.test((tc) => {
    const source = tc.draw(validProgram);
    tc.note(source);
    assert.equal(parseSource(source), true);
    completedCases += 1;
  }, SETTINGS);

  assert.ok(completedCases >= TEST_CASES);
});

test("unsupported characters require parser recovery", () => {
  let completedCases = 0;

  hegel.test((tc) => {
    const source = tc.draw(invalidProgram);
    tc.note(source);
    assert.equal(parseSource(source), false);
    completedCases += 1;
  }, SETTINGS);

  assert.ok(completedCases >= TEST_CASES);
});
