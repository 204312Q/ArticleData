type UserAgentValidationResult = { valid: true } | { valid: false; error: string };

const AUTOMATION_UA_PATTERNS: RegExp[] = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /aiohttp/i,
  /httpclient/i,
  /libwww-perl/i,
  /postmanruntime/i,
  /insomnia/i,
  /go-http-client/i,
  /java\/\d+/i,
];

export function validateUserAgent(userAgent: string | null): UserAgentValidationResult {
  const ua = userAgent?.trim() ?? '';

  if (!ua) {
    return { valid: false, error: 'Suspicious request detected' };
  }

  if (AUTOMATION_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    return { valid: false, error: 'Suspicious request detected' };
  }

  return { valid: true };
}
