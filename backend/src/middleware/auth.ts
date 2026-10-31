import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not set");
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing token" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === "string" || !payload.sub) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    res.locals.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}