import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({
      message: "Login required"
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }
    next();
  };
};
