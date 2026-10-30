// TNCC Admin Configuration
// The user specified:
// "Ipothiiku antha demo admin button irukatum aprm naa entha mail id soldrano antha mail id ku mattum thaan admin access view pandra meri irukanum"
// Whenever the user provides their admin email address, add it to this array!

export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  // User will provide their specific admin email:
  // e.g. 'admin@valavanacademy.com',
];

export function checkIsAdmin(email?: string | null, isDemoAdmin?: boolean): boolean {
  if (isDemoAdmin) return true;
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.some((e) => e.toLowerCase() === email.trim().toLowerCase());
}
