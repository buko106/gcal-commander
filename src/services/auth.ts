import { injectable } from 'tsyringe';

import { getCalendarAuth } from '../auth';
import { AuthResult, IAuthService } from '../interfaces/services';

@injectable()
export class AuthService implements IAuthService {
  async getCalendarAuth(): Promise<AuthResult> {
    const auth = await getCalendarAuth();
    return { client: auth.client };
  }
}