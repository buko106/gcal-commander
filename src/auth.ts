import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { AppPaths } from './utils/paths';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = AppPaths.getTokenPath();
const CREDENTIALS_PATH = AppPaths.getCredentialsPath();

export interface CalendarAuth {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadSavedCredentialsIfExist(): Promise<any> {
  try {
    const content = await readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveCredentials(client: any): Promise<void> {
  try {
    const content = await readFile(CREDENTIALS_PATH, 'utf8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      // eslint-disable-next-line camelcase
      client_id: key.client_id,
      // eslint-disable-next-line camelcase
      client_secret: key.client_secret,
      // eslint-disable-next-line camelcase
      refresh_token: client.credentials.refresh_token,
      type: 'authorized_user',
    });

    const tokenDir = dirname(TOKEN_PATH);
    await mkdir(tokenDir, { recursive: true });
    await writeFile(TOKEN_PATH, payload);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function authorize(): Promise<any> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  try {
    client = await authenticate({
      keyfilePath: CREDENTIALS_PATH,
      scopes: SCOPES,
    });

    if (client.credentials) {
      await saveCredentials(client);
    }

    return client;
  } catch (error) {
    throw new Error(`Authentication failed: ${error}`);
  }
}

export async function getCalendarAuth(): Promise<CalendarAuth> {
  const client = await authorize();
  return { client };
}

export function getCredentialsPath(): string {
  return CREDENTIALS_PATH;
}

export function getTokenPath(): string {
  return TOKEN_PATH;
}
