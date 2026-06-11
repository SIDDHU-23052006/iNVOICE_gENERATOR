CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"number" text NOT NULL,
	"date" text NOT NULL,
	"due_date" text NOT NULL,
	"po_number" text,
	"place_of_supply" text,
	"bill_to_name" text NOT NULL,
	"bill_to_address" text,
	"bill_to_country" text,
	"bill_to_state" text,
	"bill_to_gstin" text,
	"bill_to_pan" text,
	"bill_to_email" text,
	"bill_to_phone" text,
	"items" jsonb NOT NULL,
	"tax_mode" text NOT NULL,
	"gst_type" text,
	"global_discount" numeric DEFAULT '0' NOT NULL,
	"shipping" numeric DEFAULT '0' NOT NULL,
	"notes" text,
	"terms" text,
	"payment_details" jsonb NOT NULL,
	"totals" jsonb NOT NULL,
	"is_draft" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"invoice_format" text DEFAULT 'auto' NOT NULL,
	"invoice_prefix" text,
	"tax_mode" text DEFAULT 'india_gst' NOT NULL,
	"default_gst_rate" integer DEFAULT 18 NOT NULL,
	"default_terms" text,
	"default_notes" text,
	"payment_bank_name" text,
	"payment_account" text,
	"payment_ifsc" text,
	"payment_upi" text,
	CONSTRAINT "preferences_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"contact_name" text,
	"phone" text,
	"country" text,
	"state" text,
	"city" text,
	"address" text,
	"postal_code" text,
	"gstin" text,
	"pan" text,
	"tax_id" text,
	"website" text,
	"industry" text,
	"logo" text,
	"signature" text,
	"stamp" text,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preferences" ADD CONSTRAINT "preferences_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;