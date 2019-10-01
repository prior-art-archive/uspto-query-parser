# We use a lexer to split the string into tokens
@{%
	const moo = require('moo')

	const lexer = moo.compile({
		whitespace: { match: /\s+/, lineBreaks: true },
		term: [
			{
				match: /[^\s]+/,
			},
		],
	})
%}

@lexer lexer

query -> _ clause

clause ->
	  terms

terms -> (
	  atomicTerms _
):+

atomicTerms ->
	  %term

################
## Whitespace ##
_ -> (%whitespace:+):?
__ -> %whitespace
