export function sitePath(value: string, baseUrl = import.meta.env.BASE_URL) {
  const input = String(value || '').trim();
  if (!input || input.startsWith('#') || input.startsWith('//') || /^(?:[a-z]+:|data:)/i.test(input)) {
    return input;
  }
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${input.replace(/^\/+/, '')}`;
}
