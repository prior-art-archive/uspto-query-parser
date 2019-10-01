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
})
