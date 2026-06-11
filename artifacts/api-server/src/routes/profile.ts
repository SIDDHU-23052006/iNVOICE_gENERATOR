import { Router } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

// Get Profile
router.get("/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
  res.json(req.user);
});

// Update Profile
router.post("/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updateData = req.body;

  try {
    const result = await db
      .update(profilesTable)
      .set({
        name: updateData.name ?? user.name,
        contactName: updateData.contactName !== undefined ? updateData.contactName : user.contactName,
        phone: updateData.phone !== undefined ? updateData.phone : user.phone,
        country: updateData.country !== undefined ? updateData.country : user.country,
        state: updateData.state !== undefined ? updateData.state : user.state,
        city: updateData.city !== undefined ? updateData.city : user.city,
        address: updateData.address !== undefined ? updateData.address : user.address,
        postalCode: updateData.postalCode !== undefined ? updateData.postalCode : user.postalCode,
        gstin: updateData.gstin !== undefined ? updateData.gstin : user.gstin,
        pan: updateData.pan !== undefined ? updateData.pan : user.pan,
        taxId: updateData.taxId !== undefined ? updateData.taxId : user.taxId,
        website: updateData.website !== undefined ? updateData.website : user.website,
        industry: updateData.industry !== undefined ? updateData.industry : user.industry,
        logo: updateData.logo !== undefined ? updateData.logo : user.logo,
        signature: updateData.signature !== undefined ? updateData.signature : user.signature,
        stamp: updateData.stamp !== undefined ? updateData.stamp : user.stamp,
      })
      .where(eq(profilesTable.id, user.id))
      .returning();

    res.json(result[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
