/**
 * Shared server-side validation for the contact and newsletter endpoints.
 * Trust boundary: this runs on the Worker, the client-side `required`/
 * `maxlength` attributes are UX only and must never be trusted alone.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value);
}

export function cleanString(value: FormDataEntryValue | null, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

/** Any non-empty honeypot field means a bot filled in a field real users never see. */
export function isBot(formData: FormData, honeypotField = 'bot-field'): boolean {
  return cleanString(formData.get(honeypotField), 200).length > 0;
}
