# We use a lexer to split the string into tokens
@{%
	const moo = require('moo')

	const lexer = moo.compile({
		literal: /".*?"/, // Exact phrases can be included in double quotes
		whitespace: { match: /\s+/, lineBreaks: true },
		unpairedQuote: /"/, // To be treated as whitespace
		term: [
			{
				match: /[^\s"]+/,
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
	| %literal

################
## Whitespace ##
_ -> (whitespace:+):?

__ -> whitespace

whitespace ->
	  %whitespace
	| %unpairedQuote
