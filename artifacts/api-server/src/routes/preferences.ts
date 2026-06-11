import { Router } from "express";
import { db, preferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

// Get Preferences
router.get("/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  try {
    const prefs = await db.select().from(preferencesTable).where(eq(preferencesTable.profileId, user.id)).limit(1);
    if (prefs.length === 0) {
      // Create default if missing
      const result = await db.insert(preferencesTable).values({
        profileId: user.id,
        currency: "INR",
        invoiceFormat: "auto",
        taxMode: "india_gst",
        defaultGstRate: 18,
      }).returning();
      res.json(result[0]);
    } else {
      res.json(prefs[0]);
    }
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Preferences
router.post("/preferences", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const updateData = req.body;

  try {
    // Check if preferences row exists
    const existing = await db.select().from(preferencesTable).where(eq(preferencesTable.profileId, user.id)).limit(1);
    
    let result;
    if (existing.length === 0) {
      result = await db.insert(preferencesTable).values({
        profileId: user.id,
        currency: updateData.currency ?? "INR",
        invoiceFormat: updateData.invoiceFormat ?? "auto",
        invoicePrefix: updateData.invoicePrefix,
        taxMode: updateData.taxMode ?? "india_gst",
        defaultGstRate: updateData.defaultGstRate ?? 18,
        defaultTerms: updateData.defaultTerms,
        defaultNotes: updateData.defaultNotes,
        paymentBankName: updateData.paymentBankName,
        paymentAccount: updateData.paymentAccount,
        paymentIfsc: updateData.paymentIfsc,
        paymentUpi: updateData.paymentUpi,
      }).returning();
    } else {
      result = await db.update(preferencesTable).set({
        currency: updateData.currency !== undefined ? updateData.currency : existing[0].currency,
        invoiceFormat: updateData.invoiceFormat !== undefined ? updateData.invoiceFormat : existing[0].invoiceFormat,
        invoicePrefix: updateData.invoicePrefix !== undefined ? updateData.invoicePrefix : existing[0].invoicePrefix,
        taxMode: updateData.taxMode !== undefined ? updateData.taxMode : existing[0].taxMode,
        defaultGstRate: updateData.defaultGstRate !== undefined ? updateData.defaultGstRate : existing[0].defaultGstRate,
        defaultTerms: updateData.defaultTerms !== undefined ? updateData.defaultTerms : existing[0].defaultTerms,
        defaultNotes: updateData.defaultNotes !== undefined ? updateData.defaultNotes : existing[0].defaultNotes,
        paymentBankName: updateData.paymentBankName !== undefined ? updateData.paymentBankName : existing[0].paymentBankName,
        paymentAccount: updateData.paymentAccount !== undefined ? updateData.paymentAccount : existing[0].paymentAccount,
        paymentIfsc: updateData.paymentIfsc !== undefined ? updateData.paymentIfsc : existing[0].paymentIfsc,
        paymentUpi: updateData.paymentUpi !== undefined ? updateData.paymentUpi : existing[0].paymentUpi,
      })
      .where(eq(preferencesTable.profileId, user.id))
      .returning();
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
