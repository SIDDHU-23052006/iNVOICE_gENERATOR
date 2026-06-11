import type { Request, Response, NextFunction } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthenticatedRequest extends Request {
  user?: typeof profilesTable.$inferSelect;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }

  const email = authHeader.substring(7).trim();
  if (!email) {
    res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    return;
  }

  try {
    const profiles = await db.select().from(profilesTable).where(eq(profilesTable.email, email)).limit(1);
    if (profiles.length === 0) {
      res.status(401).json({ error: "Unauthorized: User does not exist" });
      return;
    }
    req.user = profiles[0];
    next();
  } catch (error) {
    res.status(500).json({ error: "Database error during authentication" });
  }
}
