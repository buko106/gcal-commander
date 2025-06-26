import {confirm} from '@inquirer/prompts'
import {render} from '@inquirer/testing'
import {expect} from 'chai'

describe('init command', () => {
  describe('prompt interaction testing', () => {
    it('should handle confirm prompt - yes', async () => {
      const {answer, events} = await render(confirm, {
        message: 'Do you want to continue with initial setup?'
      })

      events.type('y')
      events.keypress('enter')

      const result = await answer
      expect(result).to.be.true
    })

    it('should handle confirm prompt - no', async () => {
      const {answer, events} = await render(confirm, {
        message: 'Do you want to continue with initial setup?'
      })

      events.type('n')
      events.keypress('enter')

      const result = await answer
      expect(result).to.be.false
    })
  })
})
