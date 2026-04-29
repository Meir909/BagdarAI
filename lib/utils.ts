import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSchoolCode(cityName: string): string {
  const year = new Date().getFullYear();
  const city = cityName.toUpperCase().replace(/\s+/g, "-").slice(0, 10);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `SCHOOL-${year}-${city}-${random}`;
}

export function generateInvitationCode(schoolAbbr: string): string {
  const abbr = schoolAbbr.toUpperCase().replace(/\s+/g, "").slice(0, 5);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${abbr}-${random}`;
}

export function generateStudentCode(): string {
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `STU-${random}`;
}
