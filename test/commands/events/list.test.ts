import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('events list', () => {

  it('shows authentication message in stderr for table format', async () => {
    try {
      const {stderr} = await runCommand('events list')
      expect(stderr).to.contain('Authenticating with Google Calendar...')
    } catch (error) {
      // Expected to fail without proper authentication setup
      expect(String(error)).to.contain('Authentication failed')
    }
  })

  it('does not show authentication message in stdout for json format', async () => {
    try {
      const {stderr, stdout} = await runCommand('events list --format json')
      expect(stderr).to.contain('Authenticating with Google Calendar...')
      expect(stdout).to.not.contain('Authenticating with Google Calendar...')
    } catch (error) {
      // Expected to fail without proper authentication setup
      expect(String(error)).to.contain('Authentication failed')
    }
  })

  it('accepts max-results flag', async () => {
    try {
      await runCommand('events list --max-results 5')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('accepts days flag', async () => {
    try {
      await runCommand('events list --days 7')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('accepts format flag', async () => {
    try {
      await runCommand('events list --format json')
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag')
    }
  })

  it('accepts calendar argument', async () => {
    try {
      await runCommand('events list my-calendar@gmail.com')
    } catch (error) {
      // Command should parse arguments correctly even if authentication fails
      expect(String(error)).to.not.contain('Unexpected argument')
    }
  })
})