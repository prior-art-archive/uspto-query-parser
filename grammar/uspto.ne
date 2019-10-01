# We use a lexer to split the string into tokens
@{%
	const moo = require('moo')

	const lexer = moo.compile({
		comment: /#.*/,
		literal: /".*?"/, // Exact phrases can be included in double quotes
		whitespace: { match: /\s+/, lineBreaks: true },
		number: /\d+/,
		unpairedQuote: '"', // To be treated as whitespace
		orOperator: '|', // An alternative to "OR"
		andOperator: '&', // An alternative to "AND"
		leftParen: '(',
		rightParen: ')',
		term: [
			{
				match: /[^\s"#\|&()\d]+/,
				type: moo.keywords({
					booleanOperator: ['OR', 'AND', 'NOT', 'XOR'],
					proximityOperator: ['ADJ','NEAR','WITH','SAME'],
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
	| proximityClause _
):+

atomicTerms ->
	  %term
	| %literal
	| %number

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
## Proximity Clauses ##
# clauses that identify pairs of nearby terms
proximityClause ->
	  atomicTerms _ proximityOperator __ atomicTerms

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

#########################
## Proximity Operators ##
# Clauses that contain proximity operators.
#
# Proximity operators make it possible to compare distance between terms
# - ADJ: TermA next to TermB in the order specified in the same sentence.
# - NEAR: next to Terms in any order in the same sentence.
# - WITH: TermA in the same sentence with TermB.
# - SAME: TermA in the same paragraph with Terms
#
# You can also modify distances for some proximity clauses
# - ADJn: TermA within n terms of Bin the order specified in the same sentence.
# - NEARn: TermA within n terms of B in any order in the same sentence.
# - SAMEn: TermA within n paragraphs of TermB
# where "n" is a number
proximityOperator ->
	  %proximityOperator
	| %proximityOperator %number

################
## Whitespace ##
_ -> (whitespace:+):?
__ -> whitespace

whitespace ->
	  %whitespace
	| %unpairedQuote
