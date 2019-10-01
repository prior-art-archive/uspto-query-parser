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
	it('Valid strings should pass', () => {
		testValidInput('banana')
		testValidInput(' banana')
		testValidInput('banana pie')
	})
})
