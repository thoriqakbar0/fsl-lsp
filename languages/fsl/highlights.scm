(comment) @comment
(string) @string
(number) @number
(operator) @operator
(punctuation) @punctuation

(annotation
  "@" @punctuation.special
  (identifier) @attribute)

((identifier) @keyword
  (#match? @keyword "^(spec|compose|requirements|business|governance|refinement|verify|instances|values|use|internal|state|init|fair|requires|ensures|let|symmetric|impl|abs|maps|auto|map|stutter|preserve|progress|respond|implements|branches|expect|rejected|time|urgent|age|deadline|actor|stages|initial|transition|set|covers|owner|severity|applies_to|satisfies|delegates|require|satisfied_by|before|after|checked_by|owns|const|type|enum|struct|entity|number|action|invariant|trans|reachable|leadsTo|until|unless|requirement|acceptance|forbidden|kpi|process|control|policy|goal|authority|preservation|if|else|forall|exists|where|in|and|or|not|is|within|decreases|then|every|must|eventually|be|can|reach|all|while|when|with|by|from|as|of)$"))

((identifier) @type.builtin
  (#match? @type.builtin "^(Int|Bool|Map|Set|Seq|Option)$"))

((identifier) @constant.builtin
  (#match? @constant.builtin "^(true|false|none)$"))
