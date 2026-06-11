import { Router } from "express";
import { db, profilesTable, preferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Sign Up
router.post("/auth/signup", async (req, res) => {
  const { type, name, email, password, contactName, country, state, city } = req.body;

  if (!email || !password || !name || !type) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    // Check if user already exists
    const existing = await db.select().from(profilesTable).where(eq(profilesTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "A user with this email already exists" });
      return;
    }

    // Insert profile
    const result = await db.insert(profilesTable).values({
      email,
      password,
      type,
      name,
      contactName,
      country,
      state,
      city,
    }).returning();

    const newProfile = result[0];

    // Create default preferences
    await db.insert(preferencesTable).values({
      profileId: newProfile.id,
      currency: "INR",
      invoiceFormat: "auto",
      taxMode: "india_gst",
      defaultGstRate: 18,
    });

    res.json(newProfile);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sign In
router.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  try {
    const profiles = await db.select().from(profilesTable).where(eq(profilesTable.email, email)).limit(1);
    if (profiles.length === 0 || profiles[0].password !== password) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    res.json(profiles[0]);
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
