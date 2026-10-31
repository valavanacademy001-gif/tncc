// TNCC Admin Configuration
// Authorized administrator emails
export const AUTHORIZED_ADMIN_EMAILS: string[] = [
  'suganeshsugu07@gmail.com',
  'suganeshsugu07@gmailcom',
];

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    AUTHORIZED_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === normalized) ||
    normalized === 'suganesh_admin' ||
    normalized === 'suganesh'
  );
}
