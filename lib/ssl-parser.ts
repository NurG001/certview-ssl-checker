// lib/ssl-parser.ts

/**
 * Heuristic logic to identify certificate validation types:
 * - DV: Only the Common Name (CN) is verified; Organization (O) is empty.
 * - OV: Organization (O) is verified and present.
 * - EV: Highest vetting; includes O plus specific jurisdiction fields or EV OIDs.
 */
export function getValidationType(subject: any): "DV" | "OV" | "EV" | "Unknown" {
  if (!subject) return "Unknown";

  const hasOrg = !!subject.O;
  // EV certs often include jurisdiction and business category OIDs in the subject
  const hasEVFields = !!(subject.jurisdictionC || subject.businessCategory || subject.serialNumber);

  if (hasOrg && hasEVFields) return "EV";
  if (hasOrg) return "OV";
  return "DV";
}

export function calculateDaysLeft(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}