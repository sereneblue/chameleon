export default function isChallengeURL(value: string): boolean {
  try {
    const url = new URL(value);
    return url.origin === 'https://challenges.cloudflare.com' && (url.pathname.startsWith('/turnstile/') || url.pathname.startsWith('/cdn-cgi/challenge-platform/'));
  } catch {}

  return false;
}
