import { sleep } from './utility';

export const PK_USERID = '466378653216014359';
export const baseEndpoint = 'https://api.pluralkit.me/v2';
const userAgent = 'PLURALCHUM (github.com/estroBiologist/pluralchum)';
const delayPerRequest = 600;

let currentRequests = -1;
export async function httpGetAsync(url) {
  currentRequests += 1;
  await sleep(currentRequests * delayPerRequest);
  const headers = new Headers({ 'User-Agent': userAgent });
  const response = await fetch(url, { headers });
  currentRequests -= 1;
  return response;
}
