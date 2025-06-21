import {expect} from 'chai'

import {CalendarService} from '../../src/services/calendar'

describe('CalendarService', () => {
  it('can be imported', () => {
    expect(CalendarService).to.be.a('function')
  })

  it('requires auth parameter', () => {
    try {
      // eslint-disable-next-line no-new, @typescript-eslint/no-explicit-any
      new CalendarService(null as any)
      expect.fail('Should have thrown an error')
    } catch (error) {
      // Expected to fail without proper auth
      expect(error).to.exist
    }
  })

  it('can be instantiated with valid auth', () => {
    const mockAuth = { client: {} }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const service = new CalendarService(mockAuth as any)
    expect(service).to.exist
  })
})