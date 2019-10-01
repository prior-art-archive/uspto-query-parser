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
})
