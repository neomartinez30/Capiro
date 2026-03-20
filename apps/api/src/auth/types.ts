export interface AuthenticatedUser {
  sub: string;
  email: string;
  tenantId: string;
  role: string;
  userId: string;
  firstName: string;
  lastName: string;
}
