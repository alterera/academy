/**
 * Phone number utilities using libphonenumber-js
 * Handles parsing, validation, and E.164 formatting
 */

import {
  parsePhoneNumberFromString,
  CountryCode,
  PhoneNumber,
} from "libphonenumber-js";

export interface ParsedPhone {
  isValid: boolean;
  e164: string | null;
  countryCode: string | null;
  nationalNumber: string | null;
}

/**
 * Parse and validate a phone number
 * @param phone - Raw phone number input
 * @param defaultCountry - Default country code (default: IN for India)
 * @returns Parsed phone details with validation status
 */
export function parsePhone(
  phone: string,
  defaultCountry: CountryCode = "IN"
): ParsedPhone {
  try {
    const parsed: PhoneNumber | undefined = parsePhoneNumberFromString(
      phone,
      defaultCountry
    );

    if (!parsed) {
      return {
        isValid: false,
        e164: null,
        countryCode: null,
        nationalNumber: null,
      };
    }

    return {
      isValid: parsed.isValid(),
      e164: parsed.isValid() ? parsed.format("E.164") : null,
      countryCode: parsed.countryCallingCode || null,
      nationalNumber: parsed.nationalNumber || null,
    };
  } catch {
    return {
      isValid: false,
      e164: null,
      countryCode: null,
      nationalNumber: null,
    };
  }
}

/**
 * Validate and normalize phone to E.164 format
 * @returns E.164 formatted number or null if invalid
 */
export function normalizePhone(
  phone: string,
  defaultCountry: CountryCode = "IN"
): string | null {
  const parsed = parsePhone(phone, defaultCountry);
  return parsed.isValid ? parsed.e164 : null;
}

/**
 * Mask phone number for logging (e.g., +91*******123)
 * Never log full phone numbers for privacy
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return "***";
  const start = phone.slice(0, 3);
  const end = phone.slice(-3);
  return `${start}*******${end}`;
}

/**
 * Check if a phone number is valid
 */
export function isValidPhone(
  phone: string,
  defaultCountry: CountryCode = "IN"
): boolean {
  return parsePhone(phone, defaultCountry).isValid;
}

