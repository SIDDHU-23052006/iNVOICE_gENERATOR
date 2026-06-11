import { pgTable, serial, text, integer, numeric, jsonb } from "drizzle-orm/pg-core";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(), // 'organization' | 'individual'
  name: text("name").notNull(),
  contactName: text("contact_name"),
  phone: text("phone"),
  country: text("country"),
  state: text("state"),
  city: text("city"),
  address: text("address"),
  postalCode: text("postal_code"),
  gstin: text("gstin"),
  pan: text("pan"),
  taxId: text("tax_id"),
  website: text("website"),
  industry: text("industry"),
  logo: text("logo"), // base64 string
  signature: text("signature"), // base64 string
  stamp: text("stamp"), // base64 string
});

export const preferencesTable = pgTable("preferences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profilesTable.id, { onDelete: "cascade" }).notNull().unique(),
  currency: text("currency").default("INR").notNull(),
  invoiceFormat: text("invoice_format").default("auto").notNull(),
  invoicePrefix: text("invoice_prefix"),
  taxMode: text("tax_mode").default("india_gst").notNull(),
  defaultGstRate: integer("default_gst_rate").default(18).notNull(),
  defaultTerms: text("default_terms"),
  defaultNotes: text("default_notes"),
  paymentBankName: text("payment_bank_name"),
  paymentAccount: text("payment_account"),
  paymentIfsc: text("payment_ifsc"),
  paymentUpi: text("payment_upi"),
});

export const invoicesTable = pgTable("invoices", {
  id: text("id").primaryKey(), // invoice uuid/id from client
  profileId: integer("profile_id").references(() => profilesTable.id, { onDelete: "cascade" }).notNull(),
  number: text("number").notNull(),
  date: text("date").notNull(),
  dueDate: text("due_date").notNull(),
  poNumber: text("po_number"),
  placeOfSupply: text("place_of_supply"),
  billToName: text("bill_to_name").notNull(),
  billToAddress: text("bill_to_address"),
  billToCountry: text("bill_to_country"),
  billToState: text("bill_to_state"),
  billToGstin: text("bill_to_gstin"),
  billToPan: text("bill_to_pan"),
  billToEmail: text("bill_to_email"),
  billToPhone: text("bill_to_phone"),
  items: jsonb("items").notNull(), // Array of items
  taxMode: text("tax_mode").notNull(),
  gstType: text("gst_type"), // intra_state / inter_state
  globalDiscount: numeric("global_discount").default("0").notNull(),
  shipping: numeric("shipping").default("0").notNull(),
  notes: text("notes"),
  terms: text("terms"),
  paymentDetails: jsonb("payment_details").notNull(),
  totals: jsonb("totals").notNull(),
  isDraft: integer("is_draft").default(0).notNull(), // 0 = false, 1 = true
});