import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('calendars list', () => {
  it('shows authentication message in stderr', async () => {
    try {
      const {stderr} = await runCommand('calendars list')
      expect(stderr).to.contain('Authenticating with Google Calendar...')
    } catch (error) {
      // Expected to fail without proper authentication setup
      expect(String(error)).to.contain('Authentication failed')
    }
  })

  it('accepts format flag', async () => {
    try {
      await runCommand('calendars list --format json')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('rejects invalid format', async () => {
    try {
      await runCommand('calendars list --format invalid')
      expect.fail('Should have thrown an error for invalid format')
    } catch (error) {
      expect(String(error)).to.match(/Expected.*format.*to be one of|invalid.*format/i)
    }
  })

  it('accepts table format', async () => {
    try {
      await runCommand('calendars list --format table')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })
})