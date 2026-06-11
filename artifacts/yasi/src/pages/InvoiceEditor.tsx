import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { InvoiceData, InvoiceItem, getProfile, getPreferences, getDraftInvoice, saveDraftInvoice } from "@/lib/storage";
import { getDraftInvoice as fetchDraftInvoice, saveDraftInvoice as pushDraftInvoice } from "@workspace/api-client-react";
import { computeInvoiceTotals } from "@/lib/tax";
import { generateAutoInvoiceNumber } from "@/lib/invoice-number";
import { InvoicePreview } from "@/components/InvoicePreview";
import { downloadInvoicePdf } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/currency";
import { toast } from "sonner";

export default function InvoiceEditor() {
  const profile = getProfile();
  const preferences = getPreferences();

  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    // Start with a clean default state matching preferences
    return {
      id: crypto.randomUUID(),
      number: preferences.invoiceFormat === "auto" ? generateAutoInvoiceNumber(preferences.invoicePrefix) : "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      poNumber: "",
      placeOfSupply: profile?.state || "",
      from: profile || {},
      billTo: { name: "", address: "", country: "", state: "", gstin: "", pan: "", email: "", phone: "" },
      items: [],
      taxMode: preferences.taxMode,
      gstType: "intra_state",
      globalDiscount: 0,
      shipping: 0,
      notes: preferences.defaultNotes || "",
      terms: preferences.defaultTerms || "",
      paymentDetails: {
        bankName: preferences.paymentBankName || "",
        account: preferences.paymentAccount || "",
        ifsc: preferences.paymentIfsc || "",
        upi: preferences.paymentUpi || ""
      },
      totals: { subtotal: 0, discount: 0, taxableAmount: 0, cgst: 0, sgst: 0, igst: 0, vat: 0, roundOff: 0, grandTotal: 0 }
    };
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  // Load draft from DB (with local fallback) on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const dbDraft = await fetchDraftInvoice();
        if (dbDraft && dbDraft.id) {
          setInvoice(prev => ({
            ...prev,
            ...(dbDraft as any),
            from: { ...(dbDraft.from || {}), ...(profile || {}) },
          }));
          return;
        }
      } catch (e) {
        console.warn("Failed to fetch draft from DB:", e);
      }

      // Local fallback
      const draft = getDraftInvoice();
      if (draft && draft.id) {
        setInvoice(prev => ({
          ...prev,
          ...(draft as InvoiceData),
          from: { ...(draft.from || {}), ...(profile || {}) },
        }));
      }
    };
    loadDraft();
  }, []);

  useEffect(() => {
    const totals = computeInvoiceTotals(invoice.items, invoice.taxMode, invoice.gstType, invoice.globalDiscount, invoice.shipping);
    setInvoice(prev => ({ ...prev, totals }));
  }, [invoice.items, invoice.taxMode, invoice.gstType, invoice.globalDiscount, invoice.shipping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftInvoice(invoice);
      pushDraftInvoice(invoice as any).catch(err => {
        console.warn("Failed to autosave draft to NeonDB:", err);
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [invoice]);

  const updateInvoice = (field: keyof InvoiceData, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const updateBillTo = (field: keyof InvoiceData["billTo"], value: string) => {
    setInvoice(prev => ({
      ...prev,
      billTo: { ...prev.billTo, [field]: value }
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      type: "service",
      description: "",
      hsn: "",
      qty: 1,
      unit: "pcs",
      unitPrice: 0,
      discountPercent: 0,
      taxRate: preferences.defaultGstRate || 18,
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const validateInvoice = () => {
    if (!invoice.from.name) return "Sender Name is required in 'From' section";
    if (!invoice.billTo.name) return "Client Name is required in 'Bill To' section";
    if (!invoice.number) return "Invoice Number is required";
    if (invoice.items.length === 0) return "Please add at least one line item";
    return null;
  };

  const handleDownload = () => {
    const error = validateInvoice();
    if (error) {
      toast.error(error);
      return;
    }
    setPreviewOpen(true);
    setTimeout(() => {
      downloadInvoicePdf("yasi-invoice-pdf", invoice.number || "invoice");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <TopBar 
        onPreview={() => {
          const error = validateInvoice();
          if (error) {
            toast.error(error);
            return;
          }
          setPreviewOpen(true);
        }} 
        onDownload={handleDownload}
      />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number <span className="text-destructive">*</span></Label>
                <Input 
                  value={invoice.number} 
                  onChange={e => updateInvoice("number", e.target.value)} 
                  placeholder="INV-2024-001" 
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={invoice.date} 
                  onChange={e => updateInvoice("date", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  value={invoice.dueDate} 
                  onChange={e => updateInvoice("dueDate", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>PO Number</Label>
                <Input 
                  value={invoice.poNumber} 
                  onChange={e => updateInvoice("poNumber", e.target.value)} 
                  placeholder="PO-12345" 
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>From</CardTitle>
                <CardDescription>Auto-filled from your profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(invoice.from.logo || invoice.from.signature || invoice.from.stamp) && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted/40 border">
                    {invoice.from.logo && (
                      <div className="flex flex-col items-center gap-1">
                        <img src={invoice.from.logo} alt="Logo" className="h-12 w-12 object-contain rounded bg-white p-1 border" />
                        <span className="text-[10px] text-muted-foreground">Logo</span>
                      </div>
                    )}
                    {invoice.from.signature && (
                      <div className="flex flex-col items-center gap-1">
                        <img src={invoice.from.signature} alt="Signature" className="h-12 w-12 object-contain rounded bg-white p-1 border" />
                        <span className="text-[10px] text-muted-foreground">Signature</span>
                      </div>
                    )}
                    {invoice.from.stamp && (
                      <div className="flex flex-col items-center gap-1">
                        <img src={invoice.from.stamp} alt="Stamp" className="h-12 w-12 object-contain rounded bg-white p-1 border" />
                        <span className="text-[10px] text-muted-foreground">Stamp</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Name <span className="text-destructive">*</span></Label>
                  <Input 
                    value={invoice.from.name || ""} 
                    onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, name: e.target.value } }))} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={invoice.from.email || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, email: e.target.value } }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      value={invoice.from.phone || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, phone: e.target.value } }))} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input 
                    value={invoice.from.website || ""} 
                    onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, website: e.target.value } }))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    value={invoice.from.address || ""} 
                    onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, address: e.target.value } }))} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input 
                      value={invoice.from.city || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, city: e.target.value } }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input 
                      value={invoice.from.postalCode || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, postalCode: e.target.value } }))} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input 
                      value={invoice.from.state || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, state: e.target.value } }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input 
                      value={invoice.from.country || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, country: e.target.value } }))} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {invoice.taxMode === "india_gst" && (
                    <div className="space-y-2">
                      <Label>GSTIN</Label>
                      <Input 
                        value={invoice.from.gstin || ""} 
                        onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, gstin: e.target.value } }))} 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>PAN / Tax ID</Label>
                    <Input 
                      value={invoice.from.pan || invoice.from.taxId || ""} 
                      onChange={e => setInvoice(prev => ({ ...prev, from: { ...prev.from, pan: e.target.value } }))} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bill To</CardTitle>
                <CardDescription>Client details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client Name <span className="text-destructive">*</span></Label>
                  <Input 
                    value={invoice.billTo.name} 
                    onChange={e => updateBillTo("name", e.target.value)} 
                    placeholder="Client Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    value={invoice.billTo.address} 
                    onChange={e => updateBillTo("address", e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input 
                      value={invoice.billTo.state} 
                      onChange={e => updateBillTo("state", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input 
                      value={invoice.billTo.country} 
                      onChange={e => updateBillTo("country", e.target.value)} 
                    />
                  </div>
                </div>
                {invoice.taxMode === "india_gst" && (
                  <div className="space-y-2">
                    <Label>Client GSTIN</Label>
                    <Input 
                      value={invoice.billTo.gstin} 
                      onChange={e => updateBillTo("gstin", e.target.value)} 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Line Items</CardTitle>
              </div>
              <Button onClick={addItem} size="sm" variant="secondary">
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    No items added. Click 'Add Item' to start.
                  </div>
                ) : (
                  invoice.items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-start p-4 border rounded-lg bg-card/50">
                      <div className="col-span-12 sm:col-span-3 space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Input 
                          value={item.description} 
                          onChange={e => updateItem(item.id, "description", e.target.value)} 
                          placeholder="Item description" 
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-2">
                        <Label className="text-xs">HSN/SAC</Label>
                        <Input 
                          value={item.hsn} 
                          onChange={e => updateItem(item.id, "hsn", e.target.value)} 
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-2">
                        <Label className="text-xs">Qty</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.qty} 
                          onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-2">
                        <Label className="text-xs">Price</Label>
                        <Input 
                          type="number" 
                          value={item.unitPrice} 
                          onChange={e => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-2 space-y-2">
                        <Label className="text-xs">Tax %</Label>
                        <Input 
                          type="number" 
                          value={item.taxRate} 
                          onChange={e => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)} 
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-2 flex justify-end items-end h-full">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="notes">
                <TabsList className="mb-4">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="payment">Payment Info</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                  <Textarea 
                    rows={4} 
                    value={invoice.notes} 
                    onChange={e => updateInvoice("notes", e.target.value)} 
                    placeholder="Thanks for your business..."
                  />
                </TabsContent>
                <TabsContent value="terms">
                  <Textarea 
                    rows={4} 
                    value={invoice.terms} 
                    onChange={e => updateInvoice("terms", e.target.value)} 
                    placeholder="Terms and conditions..."
                  />
                </TabsContent>
                <TabsContent value="payment" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input 
                        value={invoice.paymentDetails.bankName} 
                        onChange={e => setInvoice(prev => ({ ...prev, paymentDetails: { ...prev.paymentDetails, bankName: e.target.value } }))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input 
                        value={invoice.paymentDetails.account} 
                        onChange={e => setInvoice(prev => ({ ...prev, paymentDetails: { ...prev.paymentDetails, account: e.target.value } }))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC / Routing</Label>
                      <Input 
                        value={invoice.paymentDetails.ifsc} 
                        onChange={e => setInvoice(prev => ({ ...prev, paymentDetails: { ...prev.paymentDetails, ifsc: e.target.value } }))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>UPI / Swift</Label>
                      <Input 
                        value={invoice.paymentDetails.upi} 
                        onChange={e => setInvoice(prev => ({ ...prev, paymentDetails: { ...prev.paymentDetails, upi: e.target.value } }))} 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tax Configuration</Label>
                  <Select value={invoice.taxMode} onValueChange={(val: any) => updateInvoice("taxMode", val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india_gst">India GST</SelectItem>
                      <SelectItem value="international">International VAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {invoice.taxMode === "india_gst" && (
                  <div className="space-y-2">
                    <Label>GST Type</Label>
                    <Select value={invoice.gstType} onValueChange={(val: any) => updateInvoice("gstType", val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intra_state">Intra-State (CGST + SGST)</SelectItem>
                        <SelectItem value="inter_state">Inter-State (IGST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Shipping</Label>
                  <Input 
                    type="number" 
                    value={invoice.shipping} 
                    onChange={e => updateInvoice("shipping", parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(invoice.totals.subtotal, preferences.currency)}</span>
                </div>
                {invoice.totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(invoice.totals.discount, preferences.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium">
                  <span>Taxable Amount</span>
                  <span>{formatCurrency(invoice.totals.taxableAmount, preferences.currency)}</span>
                </div>
                
                {invoice.taxMode === "india_gst" ? (
                  invoice.gstType === "intra_state" ? (
                    <>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>CGST</span>
                        <span>{formatCurrency(invoice.totals.cgst, preferences.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>SGST</span>
                        <span>{formatCurrency(invoice.totals.sgst, preferences.currency)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>IGST</span>
                      <span>{formatCurrency(invoice.totals.igst, preferences.currency)}</span>
                    </div>
                  )
                ) : (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>VAT</span>
                    <span>{formatCurrency(invoice.totals.vat, preferences.currency)}</span>
                  </div>
                )}

                {invoice.shipping > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{formatCurrency(invoice.shipping, preferences.currency)}</span>
                  </div>
                )}

                {invoice.totals.roundOff !== 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Round Off</span>
                    <span>{formatCurrency(invoice.totals.roundOff, preferences.currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/50">
                  <span>Total</span>
                  <span className="gradient-text">{formatCurrency(invoice.totals.grandTotal, preferences.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] overflow-y-auto p-0 gap-0 bg-gray-50/50">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Preview</h2>
            <Button onClick={handleDownload} className="gradient-bg text-white">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
          <div className="p-8 flex justify-center bg-gray-100 min-h-max">
            <InvoicePreview data={invoice} currency={preferences.currency} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
