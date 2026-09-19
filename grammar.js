module.exports = grammar({
  name: "fsl",

  extras: ($) => [/[\s\uFEFF\u2060\u200B]/, $.comment],
  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._token),

    _token: ($) => choice(
      $.annotation,
      $.string,
      $.number,
      $.identifier,
      $.operator,
      $.punctuation,
    ),

    comment: (_) => token(seq("//", /.*/)),
    annotation: ($) => seq("@", $.identifier),
    string: (_) => token(seq(
      '"',
      repeat(choice(/[^"\\\n]/, /\\./)),
      '"',
    )),
    number: (_) => /[0-9]+/,
    identifier: (_) => /[A-Za-z_][A-Za-z0-9_-]*/,
    operator: (_) => token(choice(
      "=>", "~>", "||", "->", "==", "!=", "<=", ">=", "..",
      "+", "-", "*", "/", "%", "<", ">", "=",
    )),
    punctuation: (_) => choice("{", "}", "(", ")", "[", "]", ",", ":", ";", "."),
  },
});
