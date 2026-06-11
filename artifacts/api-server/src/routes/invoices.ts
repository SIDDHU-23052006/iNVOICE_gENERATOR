import { Router } from "express";
import { db, invoicesTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router = Router();

// Get Draft Invoice
router.get("/invoices/draft", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  try {
    const drafts = await db.select().from(invoicesTable).where(
      and(
        eq(invoicesTable.profileId, user.id),
        eq(invoicesTable.isDraft, 1)
      )
    ).limit(1);

    if (drafts.length === 0) {
      res.json({});
      return;
    }

    const draft = drafts[0];
    const invoiceData = {
      id: draft.id,
      number: draft.number,
      date: draft.date,
      dueDate: draft.dueDate,
      poNumber: draft.poNumber || "",
      placeOfSupply: draft.placeOfSupply || "",
      from: {},
      billTo: {
        name: draft.billToName,
        address: draft.billToAddress || "",
        country: draft.billToCountry || "",
        state: draft.billToState || "",
        gstin: draft.billToGstin || "",
        pan: draft.billToPan || "",
        email: draft.billToEmail || "",
        phone: draft.billToPhone || "",
      },
      items: draft.items,
      taxMode: draft.taxMode,
      gstType: draft.gstType || "intra_state",
      globalDiscount: Number(draft.globalDiscount),
      shipping: Number(draft.shipping),
      notes: draft.notes || "",
      terms: draft.terms || "",
      paymentDetails: draft.paymentDetails,
      totals: draft.totals,
    };
    res.json(invoiceData);
  } catch (error) {
    console.error("Get draft invoice error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save Draft Invoice
router.post("/invoices/draft", requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const data = req.body;

  if (!data.id) {
    res.status(400).json({ error: "Invoice ID is required" });
    return;
  }

  const billTo = data.billTo || {};
  const paymentDetails = data.paymentDetails || {};
  const totals = data.totals || {};

  try {
    // Delete any existing draft for this user
    await db.delete(invoicesTable).where(
      and(
        eq(invoicesTable.profileId, user.id),
        eq(invoicesTable.isDraft, 1)
      )
    );

    // Insert new draft
    const result = await db.insert(invoicesTable).values({
      id: data.id,
      profileId: user.id,
      number: data.number || "DRAFT",
      date: data.date || "",
      dueDate: data.dueDate || "",
      poNumber: data.poNumber || "",
      placeOfSupply: data.placeOfSupply || "",
      billToName: billTo.name || "",
      billToAddress: billTo.address || "",
      billToCountry: billTo.country || "",
      billToState: billTo.state || "",
      billToGstin: billTo.gstin || "",
      billToPan: billTo.pan || "",
      billToEmail: billTo.email || "",
      billToPhone: billTo.phone || "",
      items: data.items || [],
      taxMode: data.taxMode || "india_gst",
      gstType: data.gstType || "intra_state",
      globalDiscount: String(data.globalDiscount || 0),
      shipping: String(data.shipping || 0),
      notes: data.notes || "",
      terms: data.terms || "",
      paymentDetails: paymentDetails,
      totals: totals,
      isDraft: 1,
    }).returning();

    res.json(result[0]);
  } catch (error) {
    console.error("Save draft invoice error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
