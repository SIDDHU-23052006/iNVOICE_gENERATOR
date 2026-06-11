import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { getPreferences, savePreferences, Preferences } from "@/lib/storage";
import { getPreferences as fetchPreferences, savePreferences as pushPreferences } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Partial<Preferences>>({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPreferences();
        if (data) {
          setPreferences(data as any);
          savePreferences(data as any);
        }
      } catch {
        const loadedPrefs = getPreferences();
        if (loadedPrefs) setPreferences(loadedPrefs);
      }
    };
    loadData();
  }, []);

  const handleSavePrefs = async () => {
    try {
      const data = await pushPreferences(preferences as any);
      setPreferences(data as any);
      savePreferences(data as any);
      toast.success("Preferences saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save preferences");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <TopBar showActions={false} />
      
      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/app/invoice">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Preferences</h1>
            <p className="text-muted-foreground">Manage your invoice preferences.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Preferences</CardTitle>
            <CardDescription>Default settings for new invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select value={preferences.currency} onValueChange={(val: any) => setPreferences(prev => ({ ...prev, currency: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                    <SelectItem value="SGD">SGD (S$)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Tax Mode</Label>
                <Select value={preferences.taxMode} onValueChange={(val: any) => setPreferences(prev => ({ ...prev, taxMode: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india_gst">India GST</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Invoice Numbering</Label>
                <Select value={preferences.invoiceFormat} onValueChange={(val: any) => setPreferences(prev => ({ ...prev, invoiceFormat: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-generate (INV-2024-XXXX)</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {preferences.invoiceFormat === "auto" && (
                <div className="space-y-2">
                  <Label>Custom Prefix</Label>
                  <Input value={preferences.invoicePrefix || ""} onChange={e => setPreferences(prev => ({ ...prev, invoicePrefix: e.target.value }))} placeholder="INV" />
                </div>
              )}

              <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Default Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input value={preferences.paymentBankName || ""} onChange={e => setPreferences(prev => ({ ...prev, paymentBankName: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input value={preferences.paymentAccount || ""} onChange={e => setPreferences(prev => ({ ...prev, paymentAccount: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>IFSC / SWIFT</Label>
                    <Input value={preferences.paymentIfsc || ""} onChange={e => setPreferences(prev => ({ ...prev, paymentIfsc: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input value={preferences.paymentUpi || ""} onChange={e => setPreferences(prev => ({ ...prev, paymentUpi: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Default Terms & Conditions</Label>
                  <Textarea rows={3} value={preferences.defaultTerms || ""} onChange={e => setPreferences(prev => ({ ...prev, defaultTerms: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Default Notes</Label>
                  <Textarea rows={3} value={preferences.defaultNotes || ""} onChange={e => setPreferences(prev => ({ ...prev, defaultNotes: e.target.value }))} />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSavePrefs} className="gradient-bg border-0 text-white shadow-md shadow-indigo-500/20">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
