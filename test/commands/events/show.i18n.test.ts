import {runCommand} from '@oclif/test'
import {expect} from 'chai'

import { TOKENS } from '../../../src/di/tokens'
import { I18nService } from '../../../src/services/i18n'
import { TestContainerFactory } from '../../../src/test-utils/mock-factories/test-container-factory'

describe('events show i18n integration', () => {
  afterEach(() => {
    TestContainerFactory.cleanup()
  })

  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create()
      const realI18nService = new I18nService()
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService)
      
      // Set up test event
      const testEvent = {
        id: 'test-event-123',
        summary: 'Test Event',
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
      }
      mocks.calendarService.getEvent.resolves(testEvent)
    })

    it('should display authentication message in English', async () => {
      const { stderr } = await runCommand('events show test-event-123')
      expect(stderr).to.include('Authenticating with Google Calendar...')
    })

    it('should display fetching message in English', async () => {
      const { stderr } = await runCommand('events show test-event-123')
      expect(stderr).to.include('Fetching event details...')
    })
  })

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create()
      const realI18nService = new I18nService()
      await realI18nService.init()
      await realI18nService.changeLanguage('ja')
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService)
      
      // Set up test event
      const testEvent = {
        id: 'test-event-123',
        summary: 'Test Event',
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
      }
      mocks.calendarService.getEvent.resolves(testEvent)
    })

    it('should display authentication message in Japanese', async () => {
      const { stderr } = await runCommand('events show test-event-123')
      expect(stderr).to.include('Google Calendar で認証中...')
    })

    it('should display fetching message in Japanese', async () => {
      const { stderr } = await runCommand('events show test-event-123')
      expect(stderr).to.include('イベントの詳細を取得中...')
    })
  })
})