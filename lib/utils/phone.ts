/**
 * Converts a phone number to the digits-only international format WhatsApp's
 * wa.me links need. Handles the common Nigerian local format (leading 0)
 * by swapping it for the 234 country code — e.g. "08142517798" -> "2348142517798".
 * Numbers that already include a country code pass through unchanged.
 */
export function toWhatsAppNumber(phone: string, defaultCountryCode = "234"): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return defaultCountryCode + digits.slice(1);
  }
  return digits;
}
