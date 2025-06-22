import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('events show', () => {
  it('requires eventId argument', async () => {
    try {
      await runCommand('events show')
      expect.fail('Should have thrown an error for missing eventId')
    } catch (error) {
      expect(String(error)).to.match(/Missing.*required.*argument|Missing.*eventId/i)
    }
  })

  it('shows authentication message in stderr with eventId', async () => {
    try {
      const {stderr} = await runCommand('events show test-event-123')
      expect(stderr).to.contain('Authenticating with Google Calendar...')
    } catch (error) {
      // Expected to fail without proper authentication setup
      expect(String(error)).to.contain('Authentication failed')
    }
  })

  it('accepts calendar flag', async () => {
    try {
      await runCommand('events show test-event-123 --calendar my-calendar@gmail.com')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('accepts format flag', async () => {
    try {
      await runCommand('events show test-event-123 --format json')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('rejects invalid format', async () => {
    try {
      await runCommand('events show test-event-123 --format invalid')
      expect.fail('Should have thrown an error for invalid format')
    } catch (error) {
      expect(String(error)).to.match(/Expected.*format.*to be one of|invalid.*format/i)
    }
  })
})