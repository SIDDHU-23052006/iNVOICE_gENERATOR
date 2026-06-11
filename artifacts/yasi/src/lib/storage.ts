import { z } from "zod";

export const ProfileSchema = z.object({
  type: z.enum(["organization", "individual"]),
  name: z.string().min(1, "Name is required"),
  contactName: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  logo: z.string().optional(), // base64
  signature: z.string().optional(), // base64
  stamp: z.string().optional(), // base64
});

export type Profile = z.infer<typeof ProfileSchema>;

export const PreferencesSchema = z.object({
  currency: z.enum(["INR", "USD", "EUR", "GBP", "AED", "JPY", "SGD", "CAD", "AUD"]).default("INR"),
  invoiceFormat: z.enum(["auto", "manual"]).default("auto"),
  invoicePrefix: z.string().optional(),
  taxMode: z.enum(["india_gst", "international"]).default("india_gst"),
  defaultGstRate: z.number().default(18),
  defaultTerms: z.string().optional(),
  defaultNotes: z.string().optional(),
  paymentBankName: z.string().optional(),
  paymentAccount: z.string().optional(),
  paymentIfsc: z.string().optional(),
  paymentUpi: z.string().optional(),
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export interface InvoiceItem {
  id: string;
  type: "software" | "hardware" | "service";
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discountPercent: number;
  taxRate: number;
}

export interface InvoiceData {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  poNumber: string;
  placeOfSupply: string;
  from: Partial<Profile>;
  billTo: {
    name: string;
    address: string;
    country: string;
    state: string;
    gstin: string;
    pan: string;
    email: string;
    phone: string;
  };
  items: InvoiceItem[];
  taxMode: "india_gst" | "international";
  gstType: "intra_state" | "inter_state"; // if india_gst
  globalDiscount: number;
  shipping: number;
  notes: string;
  terms: string;
  paymentDetails: {
    bankName: string;
    account: string;
    ifsc: string;
    upi: string;
  };
  totals: {
    subtotal: number;
    discount: number;
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    vat: number;
    roundOff: number;
    grandTotal: number;
  };
}

export const getProfile = (): Profile | null => {
  const data = localStorage.getItem("yasi_profile");
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (profile: Profile) => {
  localStorage.setItem("yasi_profile", JSON.stringify(profile));
};

export const getPreferences = (): Preferences => {
  const data = localStorage.getItem("yasi_preferences");
  if (data) return JSON.parse(data);
  return {
    currency: "INR",
    invoiceFormat: "auto",
    taxMode: "india_gst",
    defaultGstRate: 18,
  };
};

export const savePreferences = (prefs: Preferences) => {
  localStorage.setItem("yasi_preferences", JSON.stringify(prefs));
};

export const getDraftInvoice = (): Partial<InvoiceData> | null => {
  const data = localStorage.getItem("yasi_draft_invoice");
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as Partial<InvoiceData>;
    if (parsed.from) {
      const { logo, signature, stamp, ...rest } = parsed.from as any;
      parsed.from = rest;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveDraftInvoice = (invoice: Partial<InvoiceData>) => {
  // Strip large base64 images (logo/signature/stamp) from the draft — they live
  // in the profile and are merged back in when the draft is loaded. This keeps
  // the draft well under the localStorage quota.
  const { logo, signature, stamp, ...fromWithoutImages } = (invoice.from || {}) as any;
  const slim = { ...invoice, from: fromWithoutImages };
  try {
    localStorage.setItem("yasi_draft_invoice", JSON.stringify(slim));
  } catch (err) {
    console.warn("Failed to save invoice draft:", err);
  }
};
