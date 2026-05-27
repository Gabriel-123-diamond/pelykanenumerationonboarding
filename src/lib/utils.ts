import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validatePhoneNumber(phone: string): boolean {
  // Prefix 0: Must be exactly 11 digits
  const zeroPrefix = /^0\d{10}$/;
  // Prefix +234: Must be +234 followed by 10 digits (14 characters total)
  const countryCodePrefix = /^\+234\d{10}$/;
  
  return zeroPrefix.test(phone) || countryCodePrefix.test(phone);
}
