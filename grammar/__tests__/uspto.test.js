import grammar from '../uspto'
import nearley from 'nearley'

const getParser = () => new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

const getResult = str => getParser()
	.feed(str)
	.results

const testValidInput = str => {
	expect(() => getResult(str))
		.not.toThrow()
	expect(getResult(str))
		.toHaveLength(1)
}

describe('USPTO Grammar', () => {
	it('should parse basic tokens', () => {
		testValidInput('banana')
		testValidInput(' banana')
		testValidInput('banana pie')
	})

	it('should parse literals', () => {
		testValidInput('banana "pie"')
		testValidInput('banana pie and "ice cream"')
		testValidInput('"banana" "pie" and "ice cream"')
		testValidInput('"banana" "pie" and "ice cream" sandwiches')
	})

	it('should parse unbalanced quotes', () => {
		testValidInput('banana "pie')
		testValidInput('banana " pie')
		testValidInput('banana " pie and cake')
	})

	it('should parse comments', () => {
		testValidInput('banana "pie # is delicious')
		testValidInput('banana pie # is "very good"')
		testValidInput('banana pie#is not real')
		testValidInput('banana pie#please')
	})

	it('should parse boolean queries', () => {
		testValidInput('banana AND pie')
		testValidInput('banana & pie')
		testValidInput('banana OR pie')
		testValidInput('banana | pie')
		testValidInput('banana NOT pie')
		testValidInput('banana XOR pie')
		testValidInput('banana XOR pie AND cookies')
		testValidInput('banana AND pie AND cookies')
		testValidInput('banana AND "pie" AND cookies')
		testValidInput('banana AND "pie" AND "cookies"')
		testValidInput('banana AND "pie pans" AND "cookies"')
		testValidInput('banana OR pie OR cookies')
		testValidInput('banana | pie & cookies')
		testValidInput('banana | pie AND cookies')
	})

	it('should parse parenthetical clauses', () => {
		testValidInput('banana (pie) # is delicious')
		testValidInput('frozen (banana OR apple) pie')
		testValidInput('(banana OR apple) pie')
		testValidInput('(banana OR apple) (pie OR juice)')
		testValidInput('(fresh AND (banana OR apple)) (pie OR juice)')
		testValidInput('(fresh AND (banana OR apple)) (pie OR juice OR "frozen smoothie")')
	})

	it('should parse proximity clauses', () => {
		testValidInput('banana NEAR tree')
		testValidInput('banana ONEAR tree')
		testValidInput('banana ADJ tree')
		testValidInput('banana WITH tree')
		testValidInput('banana SAME tree')
		testValidInput('"banana tree" SAME island')
		testValidInput('(banana SAME tree) AND ("jumping" ADJ "jacks")')
	})

	it('should parse modified proximity clauses', () => {
		testValidInput('banana NEAR15 tree')
		testValidInput('banana ONEAR15 tree')
		testValidInput('banana ADJ15 tree')
		testValidInput('banana SAME15 tree')
		testValidInput('"banana tree" SAME15 island')
		testValidInput('(banana SAME2 tree) AND ("jumping" ADJ3 "jacks")')
	})

	it('should parse clauses with numbers', () => {
		testValidInput('15 bananas')
		testValidInput('"15 different" bananas')
		testValidInput('1 AND 2')
	})

	it('should parse field clauses', () => {
		testValidInput('banana ADJ15 tree monkey.ATT')
		testValidInput('"I cannot find my pants".SRC')
		testValidInput('PRAN/somebody')
		testValidInput('ART/"ONCE TOLD ME THE WORLD" # WAS GONNA ROLL ME')
	})

	it('should allow fuzzy operators', () => {
		testValidInput('banana~4')
		testValidInput('"banana soup"~7')
		testValidInput('"banana soup"~7 AND "pumpkin pie"~3 AND ice cream')
	})

	it('should allow boost operators', () => {
		testValidInput('banana^4')
		testValidInput('"chocolate pie"^100')
		testValidInput('"chocolate pie"^100 AND walnuts')
	})

	it('should allow for wildcard operators', () => {
		testValidInput('banana$')
		testValidInput('banana$15')
		testValidInput('"apple dumplings"$10')
		testValidInput('"apple dumplings"$10 AND parrots')
		testValidInput('banana$15 ADJ muffins$5')
		testValidInput('banana$15 ADJ5 muffins$5')
		testValidInput('banana$15 ADJ5 muffins$5 #why not test comments again')
		testValidInput('banana$15 15')
	})

	it('should allow for line number clauses', () => {
		testValidInput('L15')
		testValidInput('banana L15')
		testValidInput('L15 OR "pants"')
		testValidInput('L15 OR L16')
	})
})
