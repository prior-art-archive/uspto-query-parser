import grammar from '../uspto'
import nearley from 'nearley'

const getParser = () => new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

const getResult = str => getParser()
	.feed(str)
	.results

describe('USPTO Grammar', () => {
	it('Hello world should pass', () => {
		expect(() => getResult("Hello World"))
			.not.toThrow()
	})
	it('Goodbye world should fail', () => {
		expect(() => getResult("Goodbye World"))
			.toThrow()
	})
})
