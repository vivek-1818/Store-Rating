export type UserRole = "ADMIN" | "USER" | "STORE_OWNER";

export interface JwtUser {
  id: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
