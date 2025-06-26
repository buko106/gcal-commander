import {confirm} from '@inquirer/prompts'

import {BaseCommand} from '../base-command'

export default class Init extends BaseCommand {
  static description = 'Initialize gcal-commander setup'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async confirmSetup(): Promise<boolean> {
    return confirm({
      message: 'Do you want to continue with initial setup?',
      default: true,
    })
  }

  public async run(): Promise<void> {
    this.logStatus('Initial setup for gcal-commander')
    
    const shouldContinue = await this.confirmSetup()

    if (!shouldContinue) {
      this.logStatus('Setup cancelled')
      return
    }

    this.logStatus('Checking authentication...')
    
    try {
      // Check if authentication works
      const authResult = await this.authService.getCalendarAuth()
      if (authResult.client && authResult.client.credentials) {
        this.logStatus('✓ Authentication successful! Your credentials are working.')
        this.logStatus('You can now use gcal-commander to access your Google Calendar.')
      } else {
        this.logStatus('✗ Authentication failed: No valid credentials found')
        this.logStatus('Please run the authentication setup first.')
        return
      }
    } catch (error) {
      this.logStatus(`✗ Authentication failed: ${(error as Error).message}`)
      this.logStatus('Please run the authentication setup first.')
      this.logStatus('')
      this.logStatus('To set up authentication:')
      this.logStatus('1. Visit Google Cloud Console')
      this.logStatus('2. Create OAuth2 credentials')
      this.logStatus('3. Download the credentials.json file')
      this.logStatus('4. Place it in your project directory')
      return
    }
    
    this.logStatus('')
    this.logStatus('🎉 Setup completed successfully!')
    this.logStatus('You can now start using gcal-commander!')
  }
}