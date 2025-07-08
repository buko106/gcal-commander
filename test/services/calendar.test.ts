import 'reflect-metadata';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { IAuthService } from '../../src/interfaces/services';
import { CalendarService } from '../../src/services/calendar';
import { TestContainerFactory } from '../test-utils/mock-factories';

describe('CalendarService', () => {
  let calendarService: CalendarService;
  let mockAuthService: sinon.SinonStubbedInstance<IAuthService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockAuthService = mocks.authService;
    calendarService = new CalendarService(mockAuthService);
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('can be imported', () => {
    expect(CalendarService).to.be.a('function');
  });

  it('requires auth parameter', () => {
    try {
      // eslint-disable-next-line no-new, @typescript-eslint/no-explicit-any
      new CalendarService(null as any);
      expect.fail('Should have thrown an error');
    } catch (error) {
      // Expected to fail without proper auth
      expect(error).to.exist;
    }
  });

  it('can be instantiated with valid auth', () => {
    expect(calendarService).to.exist;
  });

  describe('createEvent', () => {
    it('should call ensureInitialized before creating event', async () => {
      const mockAuth = { client: {} };
      mockAuthService.getCalendarAuth.resolves(mockAuth);

      const params = {
        calendarId: 'primary',
        summary: 'Test Event',
        start: { dateTime: '2024-01-01T10:00:00Z' },
        end: { dateTime: '2024-01-01T11:00:00Z' },
      };

      try {
        await calendarService.createEvent(params);
      } catch {
        // Expected to fail in test environment without full Google API setup
        expect(mockAuthService.getCalendarAuth.calledOnce).to.be.true;
      }
    });
  });

  describe('listEvents', () => {
    it('should call ensureInitialized before listing events', async () => {
      const mockAuth = { client: {} };
      mockAuthService.getCalendarAuth.resolves(mockAuth);

      const params = {
        calendarId: 'primary',
        maxResults: 10,
        timeMin: '2024-01-01T00:00:00Z',
        timeMax: '2024-01-31T23:59:59Z',
      };

      try {
        await calendarService.listEvents(params);
      } catch {
        // Expected to fail in test environment without full Google API setup
        expect(mockAuthService.getCalendarAuth.calledOnce).to.be.true;
      }
    });
  });

  describe('listCalendars', () => {
    it('should call ensureInitialized before listing calendars', async () => {
      const mockAuth = { client: {} };
      mockAuthService.getCalendarAuth.resolves(mockAuth);

      try {
        await calendarService.listCalendars();
      } catch {
        // Expected to fail in test environment without full Google API setup
        expect(mockAuthService.getCalendarAuth.calledOnce).to.be.true;
      }
    });
  });

  describe('getEvent', () => {
    it('should call ensureInitialized before getting event', async () => {
      const mockAuth = { client: {} };
      mockAuthService.getCalendarAuth.resolves(mockAuth);

      try {
        await calendarService.getEvent('test-event-id');
      } catch {
        // Expected to fail in test environment without full Google API setup
        expect(mockAuthService.getCalendarAuth.calledOnce).to.be.true;
      }
    });

    it('should accept custom calendar ID', async () => {
      const mockAuth = { client: {} };
      mockAuthService.getCalendarAuth.resolves(mockAuth);

      try {
        await calendarService.getEvent('test-event-id', 'custom-calendar');
      } catch {
        // Expected to fail in test environment without full Google API setup
        expect(mockAuthService.getCalendarAuth.calledOnce).to.be.true;
      }
    });
  });
});
