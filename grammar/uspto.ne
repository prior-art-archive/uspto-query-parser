# We use a lexer to split the string into tokens
@{%
	const moo = require('moo')

	const lexer = moo.compile({
		comment: /#.*/,
		literal: /".*?"/, // Exact phrases can be included in double quotes
		whitespace: { match: /\s+/, lineBreaks: true },
		unpairedQuote: '"', // To be treated as whitespace
		orOperator: '|', // An alternative to "OR"
		andOperator: '&', // An alternative to "AND"
		leftParen: '(',
		rightParen: ')',
		term: [
			{
				match: /[^\s"#\|&()]+/,
				type: moo.keywords({
					booleanOperator: ['OR', 'AND', 'NOT', 'XOR'],
				}),
			},
		],
	})
%}

@lexer lexer

query -> _ clause comment:?

clause ->
	  terms
	| (terms conjunction __ clause)

conjunction ->
	booleanOperator

terms -> (
	  atomicTerms _
	| closedClause _
):+

atomicTerms ->
	  %term
	| %literal

##############
## Comments ##
# Anything following ‘#’ will be completely removed from the search text.
comment -> %comment

####################
## Closed Clauses ##
# clauses contained in parentheses
# TODO: This parser assumes balanaced parentheses
closedClause -> %leftParen _ clause %rightParen

#######################
## Boolean Operators ##
# These operators allow for combined clauses.
# - OR (or |)
# - AND (or &)
# - NOT
# - XOR
booleanOperator ->
	  %booleanOperator
	| %orOperator
	| %andOperator

################
## Whitespace ##
_ -> (whitespace:+):?
__ -> whitespace

whitespace ->
	  %whitespace
	| %unpairedQuote
